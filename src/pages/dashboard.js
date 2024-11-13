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
            const [dataRows, setDataRows] = useState();
            const [dataRows_report, setDataRows_report] = useState();
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
            const [lastStatus, setlastStatus] = useState(null);
            const [lastAlias, setlastAlias] = useState(null);
            const [lastTask, setlastTask] = useState(null);
            const [lastType, setlastType] = useState(null);
            const [lastID, setlastID] = useState(null);
            const [lastStarTime, setlastStarTime] = useState(null);
            
            
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
                fetchTaskType(selectedTaskId);
            };       
    //#endregion

    //#region Role code

        /*********************************************************************************************/
        /***                                        Role                                           ***/
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

    //#endregion
    
    //#region FormSubmit code 

        /*********************************************************************************************/
        /***               All The Validations needed for FormSubmit Base on Rolls                 ***/
        /*********************************************************************************************/
        const handleFormSubmit = async (e) => { 
            e.preventDefault();
     
            if (!formData.task && !formData.type) { 
                showAlert('error', 'Error', 'Please select both Task and Type.');
                return;
            }
        
            if ((formData.type == 57 ||  formData.type == 58 || formData.type == 59) && !formData.comments) {
                showAlert('error', 'Error', 'Please fill in the comments when selecting "Other".');
                return;
            }             
        
            if (formData.task == 1 && formData.alias.length !== 5) { 
                showAlert('error', 'Error', 'Please, the alias must be 5 characters long.');
                return;
            }  
    
            if (lastStatus === 'Start') {
                if (lastAlias !== formData.alias) {
                    showAlert('error', 'Error', 'You must complete the previous task before adding a new one.');
                    return;
                } else if (lastTask == formData.task && lastType == formData.type && lastAlias == formData.alias) {
                    // Llama a la función para actualizar la fila
                   await updateRow(lastID); 
                } else {
                    showAlert('error', 'Error', 'You must complete the previous task before adding a new one.'); 
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
                if (lastStatus === 'Start') {
                    return ['Finish', 'Stop'];
                } else if (lastStatus === 'Stop' || lastStatus === 'Finish') {
                    return ['Start'];
                }
                return ['Start'];
            };
            const availableStatusOptions = getStatusOptions();
            useEffect(() => {
                // Si `status` está vacío y hay opciones de estado disponibles, selecciona la primera
                if (availableStatusOptions.length > 0) {
                    setFormData(prevData => ({ ...prevData, status: availableStatusOptions[0] }));
                }
            }, []);

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
                if (taskOptionsByRole.length > 0) {
                    setFormData(prevData => ({ ...prevData, task: taskOptionsByRole[0].id }));
                }
            }, [taskOptionsByRole]);
    
            useEffect(() => {
                // Si `type` está vacío y hay opciones disponibles, selecciona la primera
                if (AvailableTypeOptions.length > 0) {
                    setFormData(prevData => ({ ...prevData, type: AvailableTypeOptions[0].id }));
                }
            }, [AvailableTypeOptions]);
                
    //#endregion

    //#region FormSubmit Functions

        /*********************************************************************************************/
        /***           Functions for new insert row, update row, consult row and report            ***/
        /*********************************************************************************************/

        const addNewRow = async () => {
            let currentTime = ""; 
            if(dataRows.length == 0){
                currentTime = getCurrentDateTime(); 
            }else{
                currentTime = dataRows[dataRows.length - 1].end_time;
            }
            const date_row = new Date().toISOString().slice(0, 10).replace('T', ' '); // Formato YYYY-MM-DD
            try {
                const newRowData = {
                    user_id: userId,
                    row_date: date_row, 
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
                const response = await fetch('/api/Production/register_rows', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newRowData),
                });
        
                const result = await response.json();
        
                if (result.success) {
                    fetchDailyReports(); //Refresh the table
                    // Mantiene el formulario
                    setFormData({
                        task: formData.task,
                        type: formData.type,
                        alias: formData.alias,
                        comments: formData.comments,
                        status: 'Finish',
                    });
                } else {
                    showAlert('error', 'Error', result.message || "Error adding the record."); 
                }
            } catch (error) {
                console.error(error);
                showAlert('error', 'Error', "Connection error"); 
            }
        };

        const updateRow = async (rowId) => {
            try {
                const currentTime = getCurrentDateTime(); 
                const startTime = new Date(lastStarTime); 
                const endTime = new Date(); 
                const timeDifference = endTime - startTime; 
                const elapsedMinutes = Math.floor(timeDifference / (1000 * 60));

                // Crear el objeto de datos actualizado
                const updatedRowData = {
                    comments: formData.comments,
                    status: formData.status,
                    end_time: currentTime, 
                    total_time: elapsedMinutes, 
                    role: userRole,
                };
                // Envía la solicitud PUT a la API para actualizar la fila
                const response = await fetch('/api/Production/update_rows', { 
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ rowId, ...updatedRowData }), 
                });                    
        
                const result = await response.json();

                if (result.success) {
                    setlastStatus(formData.status);
                    showAlert('success', 'Task', 'Your task was updated successfully.');
                    fetchDailyReports();
                    resetForm(); 
                    fetchAndUpdateRole();
                    fetchWeeklyReports();
                } else {
                    showAlert('error', 'Error', result.message || "Error updating the record."); 
                }
            } catch (error) {
                console.error(error);
                showAlert('error', 'Error', "Connection error"); 
            }
        };

        const fetchDailyReports = async () => {
            const currentDate = new Date().toISOString().slice(0, 10).replace('T', ' '); // Formato YYYY-MM-DD HH:mm:ss
            const user_id = localStorage.getItem('user_id');
            try {
                const response = await fetch('/api/Production/production_daily_report', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id, currentDate }),
                });                    
        
                const result = await response.json();
        
                if (result.success) {
                    const data = result.reports;
                    setDataRows(data); 
                    if(data.length > 0){
                        setlastStatus(data[data.length - 1].row_status);
                        setlastAlias(data[data.length - 1].alias);
                        setlastTask(data[data.length - 1].task_id);
                        setlastType(data[data.length - 1].type_id);
                        setlastID(data[data.length - 1].id);
                        setlastStarTime(data[data.length - 1].start_time);
                    }
                } else {
                    showAlert('error', 'Error', result.message || "Error updating the table."); 
                }
            } catch (error) {
                console.error(error);
                showAlert('error', 'Error', "Connection error");
            }
        };

        const fetchTaskType = async (selectedTaskId) => {
            try {
                const res = await fetch('/api/Production/task_type', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ task_id: selectedTaskId, role_id: userRole }), 
                });
                const data = await res.json();        
                if (data.success) {
                    setAvailableTypeOptions(data.types);
                } else {
                    showAlert('error', 'Error', 'Error fetching types: ' + data.message); 
                }
            } catch (error) {
                showAlert('error', 'Error', 'Error fetching types: ' + data.message); 
            }
        };

        const fetchAndUpdateRole = async () => {
            if (localStorage.getItem('userEmail')) {
                try {
                    // Hacer una sola solicitud para obtener el rol y las tareas asociadas
                    const res = await fetch('/api/Production/role', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: localStorage.getItem('userEmail') }),
                    });
                    const data = await res.json();
                    if (data.success) {
                        const role = data.role;
                        setTaskOptionsByRole(data.tasks);
                        setAvailableTypeOptions(data.types);
                        // Verificar si el rol cambió
                        if (userRole !== role && (lastStatus === 'Stop' || lastStatus === 'Finish')) {
                            setUserRole(role);
                            showAlert('warning', 'Role Changed', "Please be advised that your Team Lead has changed your user role. You will now be working in the following role: " + role);
                        }else {
                            setUserRole(role);
                        }
                    } else {
                        showAlert('error', 'Error', 'Failed to fetch role and tasks: ' + data.message); 
                    }
                } catch (error) {
                    showAlert('error', 'Error', 'Failed to fetch role and tasks: ' + data.message); 
                }
            }
        };

        useEffect(() => {
            fetchDailyReports(); 
            fetchAndUpdateRole();
        }, []);
    
    //#endregion

    //#region for Password changes

        /*********************************************************************************************/
        /***                                 Code for Change Password                              ***/
        /*********************************************************************************************/

            const handleOptionChange = (option) => {
                setSelectedOption(option);
                setShowPasswordChangeForm(false);
            };
            const handleSettingsButtonClick  = async (e) => {
                
                setShowPasswordChangeForm(prev => !prev);
                
                // Si el formulario ya está mostrado, selecciona "Today Work"
                if (showPasswordChangeForm) {
                    setSelectedOption('Today Work');

                } else {
                    setSelectedOption(''); // Limpiar opción al abrir el formulario de configuración
                }
            };
            const handleChangePasswordCancel = async (e) => {          
                setPasswordChangeData({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });       
            };

            const handleChangePassword = async (e) => {
                e.preventDefault();           
                try {
                    const user_name = localStorage.getItem('user_name');
                    const oldPassword = passwordChangeData.oldPassword;
                    const newPassword = passwordChangeData.newPassword;
            
                    const response = await fetch('/api/pass_change', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            user_name,
                            oldPassword,
                            newPassword
                        })
                    });
            
                    const result = await response.json();
            
                    if (result.success) {
                        console.log('Password changed successfully');
                        showAlert('success', 'Password Change', 'Password changed successfully.');
                        setPasswordChangeData({
                            oldPassword: '',
                            newPassword: '',
                            confirmPassword: '',
                        });
                    } else {
                        console.error('Error changing password:', result.message);
                        showAlert('error', 'Password Change', result.message || 'Error changing password.');
                    }
                } catch (error) {
                    console.error('Error en la solicitud:', error);
                    showAlert('error', 'Password Change', 'Failed to update password.');
                }
            };
    //#endregion

    //#region Grafic Code

        /*********************************************************************************************/
        /***                                    Grafic Code                                        ***/
        /*********************************************************************************************/
        const targetCases = 6;
        const completedCases = Array.isArray(dataRows) ? dataRows.filter(row => 
            row.task_name === 'Production' && 
            row.type_value === 'New case' && 
            row.alias.trim() !== '' &&
            row.row_status === "Finish"
        ).length : 0;  
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
            },
            animation: {
                duration: 150, 
            }
        };

        // Datos para el gráfico de producción semanal
        const [weeklyData, setWeeklyData] = useState({
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            datasets: [
                {
                    label: 'Cases per Day',
                    data: [0, 0, 0, 0, 0], // Inicializado en cero
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        });
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
            animation: {
                duration: 50, 
            },
        };

        const fetchWeeklyReports = async () => {
            const user_id = localStorage.getItem('user_id');
            try {
                const response = await fetch('/api/Production/grafic', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id }),
                });                    
        
                const result = await response.json();
        
                if (result.success) {
                    // Mapear los datos recibidos a los días de la semana
                    const weeklyCases = [0, 0, 0, 0, 0]; // Lunes a viernes

                    // Procesar cada resultado y asignarlo al índice correspondiente
                    result.reports.forEach(report => {
                        const dayIndex = report.day_of_week - 2; // Mapea 2=Lunes, 3=Martes, ..., 6=Viernes a índice 0-4
                        if (dayIndex >= 0 && dayIndex < 5) {
                            weeklyCases[dayIndex] = report.cases_per_day;
                        }
                    });
                    // Actualizar el estado de los datos del gráfico
                    setWeeklyData(prevData => ({
                        ...prevData,
                        datasets: [
                            {
                                ...prevData.datasets[0],
                                data: weeklyCases,
                            },
                        ],
                    }));
                } else {
                    showAlert('error', 'Password Change', result.message || "Error updating the table.");
                }
            } catch (error) {
                console.error(error);
                showAlert('error', 'Password Change', "Connection error.");
            }
        };
        useEffect(() => {
            fetchWeeklyReports();
        }, []);
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
                if (searchData.startDate == "") { 
                    showAlert('error', 'Error', 'Please select a start date.');
                    return;
                }
                if (searchData.endDate == "") { 
                    showAlert('error', 'Error', 'Please select an end date.');
                    return;
                }                            
                fetchReports();
            };

            const fetchReports = async () => {
                const user_id = localStorage.getItem('user_id');
                const startDate = searchData.startDate;
                const endDate = searchData.endDate;
                try {
                    const response = await fetch('/api/Production/production_report', { 
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ user_id, startDate, endDate}),
                    });                    
            
                    const result = await response.json();
            
                    if (result.success) {
                        const data = result.reports;
                        setDataRows_report(data); 
                    } else {
                        showAlert('error', 'Error', result.message || "Error updating the table.");
                    }
                } catch (error) {
                    console.error(error);
                    showAlert('error', 'Error', 'Connection error.');
                }
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
                {selectedOption === 'Today Work' && !showPasswordChangeForm && (
                    <div className={styles.mainContent}>
                        <div className={styles.formSection}>
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
                                className={styles.searchInput} 
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
                                className={styles.searchInput} 
                            />
                        </div>
                        <button type="submit" className={styles.searchButton}>Search</button>
                    </form>
                )}
                {showPasswordChangeForm && (
                    <div className={styles.changePasswordForm}>
                        <h2>Change Password</h2>
                        <form onSubmit={handleChangePassword}>
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
                            <button className={styles.cancelButton} type="button" onClick={() => handleChangePasswordCancel()}>Cancel</button>
                        </form>
                    </div>
                )}
                {selectedOption === 'Today Work' && !showPasswordChangeForm && (
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
                                {Array.isArray(dataRows) && dataRows.length > 0 ? (
                                    dataRows.map((row, index) => (
                                        <tr key={index}>
                                            <td>{row.task_name}</td>
                                            <td>{row.type_value}</td>
                                            <td>{row.alias}</td>
                                            <td>{row.commment}</td>
                                            <td>{row.row_status}</td>
                                            <td>{row.start_time}</td> 
                                            <td>{row.end_time}</td> 
                                            <td>{row.total_time + ' min'}</td> 
                                            <td>{row.role_name}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                {selectedOption === 'History' && !showPasswordChangeForm && (
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
                                {Array.isArray(dataRows_report) && dataRows_report.length > 0 ? (
                                    dataRows_report.map((row, index) => (
                                        <tr key={index}>
                                            <td>{row.task_name}</td>
                                            <td>{row.type_value}</td>
                                            <td>{row.alias}</td>
                                            <td>{row.commment}</td>
                                            <td>{row.row_status}</td>
                                            <td>{row.start_time}</td> 
                                            <td>{row.end_time}</td> 
                                            <td>{row.total_time + ' min'}</td> 
                                            <td>{row.role_name}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
