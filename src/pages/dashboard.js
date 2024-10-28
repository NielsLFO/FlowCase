import React, { useState, useEffect } from 'react'; 
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { FaCog } from 'react-icons/fa'; 
import styles from '../styles/dashboard.module.css';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useRouter } from 'next/router';

// Registrar componentes para el gráfico
ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
);
export default function Dashboard() {

    //#region States 
        /*********************************************************************************************/
        /***                                    state variables                                    ***/
        /*********************************************************************************************/
            const [selectedOption, setSelectedOption] = useState('Today Work');
            const [formData, setFormData] = useState({
                task: '',
                type: '',
                alias: '',
                comments: '',
                status: 'Start',
            });
            const [dataRows, setDataRows] = useState([]);
            const [showPasswordChangeForm, setShowPasswordChangeForm] = useState(false);
            const [passwordChangeData, setPasswordChangeData] = useState({
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            // Estado para el Snackbar y la alerta
            const [alertConfig, setAlertConfig] = useState({
                open: false,
                severity: 'error', // 'success', 'info', 'warning', o 'error'
                title: 'Error',
                message: '',
            });
            
    //#endregion

    //#region Handle Changes Events
        /*********************************************************************************************/
        /***                                handle Changes Events                                  ***/
        /*********************************************************************************************/
            const [AvailableTypeOptions, setAvailableTypeOptions] = useState([]);
            const handleFormChange = (e) => {
                const { name, value } = e.target;
                setFormData(prev => ({ ...prev, [name]: value }));
            };
            const handlePasswordChangeChange = (e) => {
                const { name, value } = e.target;
                setPasswordChangeData(prev => ({ ...prev, [name]: value }));
            };
            const handleTaskChange = async (e) => {
                const selectedTaskId = e.target.value; // Obtener el ID de la tarea seleccionada
                setFormData(prevData => ({ ...prevData, task: selectedTaskId }));    
                try {
                    const res = await fetch('/api/task_type', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ task_id: selectedTaskId, role_id: userRole }), // Enviamos task_id y role_id
                    });
                    const data = await res.json();        
                    if (data.success) {
                        setAvailableTypeOptions(data.types); // Actualizar los tipos disponibles
                    } else {
                        console.error('Error fetching types:', data.message);
                    }
                } catch (error) {
                    console.error('Error fetching types:', error);
                }
            };
            
            
    //#endregion

    //#region Roll code

        /*********************************************************************************************/
        /***                                        Roll                                           ***/
        /*********************************************************************************************/
        const [userEmail, setUserEmail] = useState(null);
        const [userRole, setUserRole] = useState(null);
        const [userId, setUserId] = useState(null);
        const [taskOptionsByRole, setTaskOptionsByRole] = useState([]);
        // Verificar si estamos en el entorno del cliente
        useEffect(() => {
            if (typeof window !== 'undefined') {
                const emailFromStorage = localStorage.getItem('userEmail');
                const roleFromStorage = localStorage.getItem('roleId');
                const user_id_FromStorage = localStorage.getItem('user_id');
                setUserEmail(emailFromStorage);
                setUserRole(roleFromStorage);
                setUserId(user_id_FromStorage);
            }
        }, []);
        // Función para actualizar los valores del tipo
        const updatetypevalue = () => {
            setFormData({
                task: '',
                type:  '', // Asegúrate de manejar el caso donde no hay opciones
                alias: '',
                comments: '',
                status: 'Start',
            });
        };

        useEffect(() => {
            const fetchAndUpdateRole = async () => {
                if (userEmail) {
                    try {
                        // Hacer una sola solicitud para obtener el rol y las tareas asociadas
                        const res = await fetch('/api/role', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ email: userEmail }),
                        });
                        const data = await res.json();
                        if (data.success) {
                            const role = data.role;
                            setTaskOptionsByRole(data.tasks);
                            setAvailableTypeOptions(data.types);
                            // Verificar si el rol cambió
                            const lastRowIndex = dataRows.length - 1;
                            const lastRow = dataRows[lastRowIndex];
                            if (dataRows.length > 0) {
                                if (userRole !== role && (lastRow.status === 'Stop' || lastRow.status === 'Finish')) {
                                    setUserRole(role);
                                    updatetypevalue();
                                    showAlert('warning', 'Role Changed', "Please be advised that your Team Lead has changed your user role. You will now be working in the following role: " + role);
                                }
                            } else {
                                setUserRole(role);
                                updatetypevalue();
                            }
                        } else {
                            console.error('Failed to fetch role and tasks:', data.message);
                        }
                    } catch (error) {
                        console.error('Error fetching role and tasks:', error);
                    }
                }
            };
        
            fetchAndUpdateRole();
        }, [dataRows, userRole]);

    //#endregion
    
    //#region FormSubmit code 

        /*********************************************************************************************/
        /***               All The Validations needed for FormSubmit Baase on Rolls                ***/
        /*********************************************************************************************/
        const handleFormSubmit = async (e) => { 
            e.preventDefault();
        
            if (!formData.task && !formData.type) { 
                showAlert('error', 'Error', 'Please select both Task and Type.');
                return;
            }
        
            if (formData.type === 'Other' && !formData.comments) {
                showAlert('error', 'Error', 'Please fill in the comments when selecting "Other".');
                return;
            }             
        
            if (formData.task === "Production" && formData.alias.length !== 5) { 
                showAlert('error', 'Error', 'Please, the alias must be 5 characters long.');
                return;
            }  
    
            if (dataRows.length > 0) {
                const lastRowIndex = dataRows.length - 1; 
                const lastRow = dataRows[lastRowIndex]; 
                const lastStatus = localStorage.getItem('lastStatus');
                if (lastStatus === 'Start') {
                    alert(lastRow.alias + " / " + formData.alias);
                    if (lastRow.alias !== formData.alias) {
                        showAlert('error', 'Error', 'You must complete the previous task before adding a new one.');
                        await updateRow(localStorage.getItem('lastInsertedId')); 
                        return;
                    } else if (lastRow.task === formData.task && lastRow.type === formData.type && lastRow.alias === formData.alias && (formData.status === 'Stop' || formData.status === 'Finish')) {
                        // Llama a la función para actualizar la fila
                        await updateRow(localStorage.getItem('lastInsertedId')); 
                    } else {
                        showAlert('error', 'Error', 'You must complete the previous task before adding a new one.'); 
                        await updateRow(localStorage.getItem('lastInsertedId')); 
                    }
                } else {
                    addNewRow();         
                }
            } else {
                addNewRow();
            }
        };
        
            function getCurrentDateTime() {
                const currentDate = new Date();
                const year = currentDate.getFullYear();
                const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Enero es 0
                const day = String(currentDate.getDate()).padStart(2, '0');
                const hours = String(currentDate.getHours()).padStart(2, '0');
                const minutes = String(currentDate.getMinutes()).padStart(2, '0');
                const seconds = String(currentDate.getSeconds()).padStart(2, '0');
                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            }
            const getStatusOptions = () => {// Función para obtener las opciones dinámicas de estado
                if (dataRows.length > 0) {
                    const lastStatus = localStorage.getItem('lastStatus');
                    alert("ultima fila: " + lastStatus);
                    if (lastStatus === 'Start') {
                        return ['Finish', 'Stop'];
                    } else if (lastStatus === 'Stop' || lastStatus === 'Finish') {
                        return ['Start'];
                    }
                }
                return ['Start'];
            };
            const availableStatusOptions = getStatusOptions();
            useEffect(() => {
                // Si `status` está vacío y hay opciones de estado disponibles, selecciona la primera
                if (!formData.status && availableStatusOptions.length > 0) {
                    setFormData(prevData => ({ ...prevData, status: availableStatusOptions[0] }));
                }
            }, [availableStatusOptions]);

            const resetForm = () => {
                setFormData({
                    task: '1',
                    type: '',
                    alias: '',
                    comments: '',
                    status: 'Start',
                });
            };

            useEffect(() => {
                // Si `task` está vacío y hay opciones disponibles, selecciona la primera
                if (!formData.task && taskOptionsByRole.length > 0) {
                    setFormData(prevData => ({ ...prevData, task: taskOptionsByRole[0].id }));
                }
            }, [taskOptionsByRole]);
    
            useEffect(() => {
                // Si `type` está vacío y hay opciones disponibles, selecciona la primera
                if (!formData.type && AvailableTypeOptions.length > 0) {
                    setFormData(prevData => ({ ...prevData, type: AvailableTypeOptions[0].id }));
                }
            }, [AvailableTypeOptions]);



            const fetchDailyReports = async () => {
                const today = new Date().toISOString().slice(0, 10); // Obtiene la fecha actual en formato YYYY-MM-DD
                try {
                    const res = await fetch('/api/production_daily_report', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ user_id: userId, row_date: today }),
                    });  
                    const result = await res.json();    
                    if (result.success) {

                        return result.reports; 
                    } else {
                        throw new Error(result.message || "Error al obtener los registros.");
                    }
                } catch (error) {
                    console.error("Error fetching daily reports:", error);
                    alert("Error al obtener los registros.");
                    return []; // Devuelve un arreglo vacío en caso de error
                }
            };

            const addNewRow = async () => {
                const currentTime = getCurrentDateTime(); // Obtener la hora actual
                try {
                    const newRowData = {
                        user_id: userId,
                        row_date: new Date().toISOString().slice(0, 19).replace('T', ' '), // Formato YYYY-MM-DD HH:mm:ss
                        task_id: formData.task,
                        type_id: formData.type,
                        alias: formData.alias,
                        commment: formData.comments,
                        row_status: formData.status,
                        start_time: currentTime,
                        total_time: 0, 
                        role_id: userRole,
                    };
                    
                    // Envía la solicitud POST a la API
                    const response = await fetch('/api/register_rows', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newRowData),
                    });
            
                    const result = await response.json();
            
                    if (result.success) {
                        // Almacena el ID en localStorage
                        localStorage.setItem('lastInsertedId', result.insertId);
                        localStorage.setItem('lastStatus', "Start");
                        // Llama a la función para cargar los registros después de la inserción
                        const reports = await fetchDailyReports(); // Llama a tu función para obtener los datos
                        setDataRows(reports); // Actualiza el estado con los nuevos registros
                        
                        // Limpia el formulario
                        setFormData({
                            task: formData.task,
                            type: formData.type,
                            alias: formData.alias,
                            comments: formData.comments,
                            status: 'Finish',
                        });
                    } else {
                        alert(result.message || "Error al añadir el registro.");
                    }
                } catch (error) {
                    console.error(error);
                    alert("Error en la conexión.");
                }
            };

            const updateRow = async (rowId) => {
                try {
                    alert("row id: " + rowId);
                    const currentTime = getCurrentDateTime(); // Obtener la hora actual
                    const endTime = new Date(); // Obtiene el tiempo actual
                    const startTime = new Date(currentTime); // Asegúrate de que currentTime sea el valor correcto de la fila a modificar
                    const timeDifference = endTime - startTime;
                    const elapsedMinutes = Math.floor(timeDifference / 60000); // Convertir a minutos
            
                    const updatedRowData = {
                        comments: formData.comments,
                        status: formData.status,
                        end_time: endTime.toISOString().slice(0, 19).replace('T', ' '), // Formato 'YYYY-MM-DD HH:MM:SS'
                        total_time: elapsedMinutes, 
                        roll: userRole,
                    };
            
                    // Envía la solicitud POST a la API para actualizar la fila
                    const response = await fetch('/api/update_rows', { // No necesitas incluir rowId en la URL
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ rowId, ...updatedRowData }), // Incluye rowId dentro del body
                    });                    
            
                    const result = await response.json();
            
                    if (result.success) {
                        localStorage.setItem('lastStatus',formData.status);

                        showAlert('success', 'Task', 'Your task was updated successfully.');
                        resetForm(); // Limpiar el formulario después de actualizar
                    } else {
                        alert(result.message || "Error al actualizar el registro.");
                    }
                } catch (error) {
                    console.error(error);
                    alert("Error en la conexión.");
                }
            };
            
                       
    //#endregion

    //#region for Password changes

        /*********************************************************************************************/
        /***                                 Code for Change Password                              ***/
        /*********************************************************************************************/

            const handlePasswordChangeSubmit = (e) => {
                e.preventDefault();
                if (passwordChangeData.newPassword === passwordChangeData.confirmPassword) {
                    // Lógica para cambiar la contraseña
                    console.log('Password changed successfully');
                    setPasswordChangeData({
                        oldPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                    });
                    setShowPasswordChangeForm(false);
                    setSelectedOption('Today Work');
                } else {
                    console.log('New passwords do not match');
                    showAlert('error', 'Password Change', 'New passwords do not match.');
                }
            };
            const handleOptionChange = (option) => {
                setSelectedOption(option);
                setShowPasswordChangeForm(false);
            };
            const handleSettingsButtonClick = () => {
                setShowPasswordChangeForm(prev => !prev);
                // Si el formulario ya está mostrado, selecciona "Today Work"
                if (showPasswordChangeForm) {
                    setSelectedOption('Today Work');
                } else {
                    setSelectedOption(''); // Limpiar opción al abrir el formulario de configuración
                }
            };
    //#endregion

    //#region Grafic Code

        /*********************************************************************************************/
        /***                                    Grafic Code                                        ***/
        /*********************************************************************************************/
        const targetCases = 6;
        const completedCases = dataRows.filter(row => 
            row.task === 'Production' && 
            row.type === 'New case' && 
            row.alias.trim() !== '' &&
            row.status === "Finish"
        ).length;   
        const chartData = {
            labels: ['Cases Completed'],
            datasets: [
                {
                    label: 'Cases Completed',
                    data: [completedCases],
                    backgroundColor: 'rgba(75,192,192,0.2)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderWidth: 1,
                    barThickness: 160,
                },
            ],
        };
        const chartOptions = {
            responsive: true,
            scales: {
                x: {beginAtZero: true, ticks: {stepSize: 1,}},
                y: {beginAtZero: true, ticks: {stepSize: 1,},
                    grid: {display: true, drawBorder: true,
                    color: '#e0e0e0', },// Color para las líneas de la cuadrícula
                    afterDataLimits: function(scale) {scale.max = Math.max(targetCases, completedCases);}
                }
            },
            plugins: {
                annotation: {
                    annotations: {
                        line1: {
                            type: 'line',
                            borderColor: '#ff0000',
                            borderWidth: 4,
                            label: {
                                content: 'Target: 6',
                                enabled: true,
                                position: 'top'
                            },
                            scaleID: 'y',
                            value: targetCases,
                            borderDash: [2, 2]
                        }
                    }
                }
            }
        };

        // Datos para el gráfico de producción semanal
        const weeklyData = {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            datasets: [
                {
                    label: 'Cases per Day',
                    data: [2, 4, 3, 4, 6], 
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        };
        // Opciones para el gráfico
        const weeklyChartOptions = {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Weekly Production Report',
                },
            },
        };
    //#endregion

    //#region Code for history section

        /*********************************************************************************************/
        /***                  All The Validations needed for History section                       ***/
        /*********************************************************************************************/

            const [searchData, setSearchData] = useState({
                startDate: '',
                endDate: '',
            });

            // Función para manejar los cambios en el formulario de búsqueda
            const handleSearchFormChange = (e) => {
                const { name, value } = e.target;
                setSearchData(prev => ({ ...prev, [name]: value }));
            };

            // Función para manejar la búsqueda (aún sin funcionalidad)
            const handleSearchSubmit = (e) => {
                e.preventDefault();
                // Aquí puedes agregar la lógica para realizar la búsqueda
                console.log('Searching from', searchData.startDate, 'to', searchData.endDate);
            };
    //#endregion

    //#region Code for alert messagess

        /*********************************************************************************************/
        /***                                   Alert Messages                                      ***/
        /*********************************************************************************************/

        // Función para abrir el Snackbar
        const showAlert = (severity, title, message) => {
            setAlertConfig({ open: true, severity, title, message });
        };
    
        // Función para cerrar el Snackbar
        const handleClose = (event, reason) => {
            if (reason === 'clickaway') return; // Evita el cierre accidental
            setAlertConfig({ ...alertConfig, open: false });
        };
    //#endregion
    
    //#region Code for login out

        /*********************************************************************************************/
        /***                                     Login Out                                         ***/
        /*********************************************************************************************/

        const router = useRouter(); // Create router instance

        const handleSignOut = () => {
            console.log('User signed out'); // Handle sign out logic if needed
            router.push('/'); // Redirect to the index page
        };

    //#endregion
    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <nav className={styles.nav}>
                    <div className={styles.leftOptions}>
                        <button
                            className={`${styles.optionButton} ${selectedOption === 'Today Work' ? styles.activeOption : ''}`}
                            onClick={() => handleOptionChange('Today Work')}
                        >
                            Today Work
                        </button>
                        <button
                            className={`${styles.optionButton} ${selectedOption === 'History' ? styles.activeOption : ''}`}
                            onClick={() => handleOptionChange('History')}
                        >
                            History
                        </button>
                    </div>
                    <div className={styles.rightOptions}>
                        <button
                            className={`${styles.signOutButton} ${showPasswordChangeForm ? styles.activeButton : ''}`}
                            onClick={handleSignOut}
                        >
                            Sign Out
                        </button>
                        <button
                            className={`${styles.settingsButton} ${showPasswordChangeForm ? styles.activeButton : ''}`}
                            onClick={handleSettingsButtonClick}
                        >
                            <FaCog />
                        </button>
                    </div>
                </nav>
            </header>
            <main className={styles.content}>
                {selectedOption === 'Today Work' && !showPasswordChangeForm && (
                    <div className={styles.mainContent}>
                        <div className={styles.formSection}>
                             {/* Snackbar para mostrar el mensaje de alerta */}
                            <Snackbar
                                open={alertConfig.open}
                                autoHideDuration={6000}
                                onClose={handleClose}
                                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                            >
                                <Alert onClose={handleClose} severity={alertConfig.severity} variant="filled">
                                    <AlertTitle>{alertConfig.title}</AlertTitle>
                                    {alertConfig.message}
                                </Alert>
                            </Snackbar>
                            <form onSubmit={handleFormSubmit}>
                                <div>
                                    <h2>Case Flow</h2>
                                    <label>Task:</label>
                                    <select name="task" value={formData.task} onChange={handleTaskChange}>
                                        {taskOptionsByRole.map(task => (
                                            <option key={task.id} value={String(task.id)}>
                                                {task.task_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label>Type:</label>
                                    <select name="type" value={formData.type} onChange={handleFormChange}>
                                        {AvailableTypeOptions.map(type => (
                                            <option key={type.id} value={String(type.id)}>
                                                {type.type_value}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    {String(formData.task) === "1" && (
                                        <>
                                            <label htmlFor="alias" className={styles.label}>Alias:</label>
                                            <input type="text" name="alias" id="alias" value={formData.alias} onChange={handleFormChange} className={styles.input} 
                                            />
                                        </>
                                    )}
                                </div>
                                <div>
                                    <label>Comments:</label>
                                    <textarea name="comments" value={formData.comments} onChange={handleFormChange} />
                                </div>
                                <div>
                                    <label htmlFor="status" className={styles.label}>Status:</label>
                                    <select name="status" id="status" value={formData.status} onChange={handleFormChange} className={styles.input}>
                                        {availableStatusOptions.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>
                                <button className={styles.submitButton} type="submit">Add Register</button>
                            </form>
                        </div>
                        <div className={styles.chartSection}>
                            <h2>Production Report</h2>
                            <p>Total cases: {completedCases} / {targetCases}</p>
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                        {/* Weekly Production Section */}
                        <div className={styles.timerSection}>
                            {/* Weekly Production Section */}
                            <div className={styles.timerSection}>
                                <h2>Weekly Production</h2>
                                <Bar data={weeklyData} options={weeklyChartOptions} />
                            </div>
                        </div>
                    </div>
                )}
                {selectedOption === 'History' && !showPasswordChangeForm &&(
                    <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                        <div>
                            <label htmlFor="startDate" className={styles.searchLabel}>Start Day:</label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={searchData.startDate}
                                onChange={handleSearchFormChange}
                                className={styles.searchInput} // Aplica el estilo del input
                            />
                        </div>
                        <div>
                            <label htmlFor="endDate" className={styles.searchLabel}>End Date:</label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={searchData.endDate}
                                onChange={handleSearchFormChange}
                                className={styles.searchInput} // Aplica el estilo del input
                            />
                        </div>
                        <button type="submit" className={styles.searchButton}>Search</button>
                    </form>
                )}
                {showPasswordChangeForm && (
                    <div className={styles.changePasswordForm}>
                        <h2>Change Password</h2>
                        <form onSubmit={handlePasswordChangeSubmit}>
                            <div>
                                <label>Old Password:</label>
                                <input
                                    type="password"
                                    name="oldPassword"
                                    value={passwordChangeData.oldPassword}
                                    onChange={handlePasswordChangeChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>New Password:</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordChangeData.newPassword}
                                    onChange={handlePasswordChangeChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Confirm New Password:</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordChangeData.confirmPassword}
                                    onChange={handlePasswordChangeChange}
                                    required
                                />
                            </div>
                            <button className={styles.submitButton_reset} type="submit">Change Password</button>
                            <button className={styles.cancelButton} type="button" onClick={() => setShowPasswordChangeForm(false)}>Cancel</button>
                        </form>
                    </div>
                )}
                {!showPasswordChangeForm && (
                    <div className={styles.tableSection}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Task</th>
                                    <th>Type</th>
                                    <th>Alias</th>
                                    <th>Comments</th>
                                    <th>Status</th>
                                    <th>Start Time</th> 
                                    <th>End Time</th> 
                                    <th>Total Time</th> 
                                    <th>Role</th> 
                                </tr>
                            </thead>
                            <tbody>
                                {dataRows.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.task_id}</td>
                                        <td>{row.type_id}</td>
                                        <td>{row.alias}</td>
                                        <td>{row.comments}</td>
                                        <td>{row.row_status}</td>
                                        <td>{row.start_time}</td> 
                                        <td>{row.end_time}</td> 
                                        <td>{row.total_time}</td> 
                                        <td>{row.role_id}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
