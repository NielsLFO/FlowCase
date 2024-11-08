import React, { useState, useEffect } from 'react'; // Asegúrate de incluir useEffect aquí
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { FaCog } from 'react-icons/fa'; // Importa el ícono de engranaje
import styles from '../styles/dashboard_TL.module.css';
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
    const [selectedOption, setSelectedOption] = useState('Today Team Work');
    const [showPasswordChangeForm, setShowPasswordChangeForm] = useState(false);
    const [dataRows, setDataRows] = useState();
    const [dataRows_Report, setDataRows_Report] = useState();
    const [TL_Technitians, setTL_Technitians] = useState([]);
    const [taskOptionsByRole, setTaskOptionsByRole] = useState([]);
    const [AvailableTypeOptions, setAvailableTypeOptions] = useState([]);
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

    //#region Changes Events
    /*********************************************************************************************/
    /***                                    Changes Events                                     ***/
    /*********************************************************************************************/
    const handlePasswordChangeChange = (e) => {
        const { name, value } = e.target;
        setPasswordChangeData(prev => ({ ...prev, [name]: value }));
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
            setSelectedOption('Today Team Work');
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
        // Si el formulario ya está mostrado, selecciona "Today Team Work"
        if (showPasswordChangeForm) {
            setSelectedOption('Today Team Work');
        } else {
            setSelectedOption(''); // Limpiar opción al abrir el formulario de configuración
        }
    };
    //#endregion

    //#region Grafic Code

    /*********************************************************************************************/
    /***                                    Grafic Code                                        ***/
    /*********************************************************************************************/

       // Paleta de colores para los técnicos (elegantes y consistentes)
        const techColors = [
            'rgba(75, 123, 139, 0.6)',  // Color para Tech #1
            'rgba(153, 102, 255, 0.6)', // Color para Tech #2
            'rgba(255, 159, 64, 0.6)',  // Color para Tech #3
            'rgba(54, 162, 235, 0.6)',  // Color para Tech #4
            'rgba(255, 206, 86, 0.6)',  // Color para Tech #5
            'rgba(105, 195, 140, 0.6)', // Color para Tech #6
        ];

        // Datos para el gráfico de producción individual
    const [individualData, setIndividualData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Cases per Technician',
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1,
            },
        ],
    });

        // Opciones para el gráfico
        const current_production_ChartOptions = {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                    position: 'top',
                },
                title: {
                    display: false,
                    text: 'Current Production Report',
                },
            },
        };


        const taskColors = [
            'rgba(66, 135, 245, 0.6)',  // Color para 'New Cases'
            'rgba(255, 166, 0, 0.6)',   // Color para 'Reworks'
            'rgba(231, 76, 60, 0.6)',   // Color para 'Team Lead Consult'
        ];
    
        // Estado para los datos del gráfico de tareas
        const [groupData, setGroupData] = useState({
            labels: [],
            datasets: [
                {
                    label: 'Tasks per Type',
                    data: [],
                    backgroundColor: taskColors,
                    borderColor: taskColors.map(color => color.replace('0.6', '1')),
                    borderWidth: 1,
                },
            ],
        });

        // Opciones para el gráfico
        const group_ChartOptions = {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                    position: 'top',
                },
                title: {
                    display: false,
                    text: 'Current Production Report by Task',
                },
            },
        };


       // Paleta de colores para los técnicos (elegantes y consistentes)
       const techColors_Idle_Time = [
        'rgba(75, 123, 139, 0.6)',  // Color para Tech #1
        'rgba(153, 102, 255, 0.6)', // Color para Tech #2
        'rgba(255, 159, 64, 0.6)',  // Color para Tech #3
        'rgba(54, 162, 235, 0.6)',  // Color para Tech #4
        'rgba(255, 206, 86, 0.6)',  // Color para Tech #5
        'rgba(105, 195, 140, 0.6)', // Color para Tech #6
        ];

        // Datos para el gráfico de producción individual
        const [individualData_Idle_Time, setIndividualData_Idle_Time] = useState({
            labels: [],
            datasets: [
                {
                    label: 'Cases per Technician',
                    data: [],
                    backgroundColor: [],
                    borderColor: [],
                    borderWidth: 1,
                },
            ],
        });

            // Opciones para el gráfico
            const current_Idle_Time_ChartOptions = {
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                        position: 'top',
                    },
                    title: {
                        display: false,
                        text: 'Current Production Report',
                    },
                },
            };



    //#endregion

    //#region Code for Manage Times section

    /*********************************************************************************************/
    /***                  All The Validations needed for Manage Times section                  ***/
    /*********************************************************************************************/

        const [searchData, setSearchData] = useState({
            startDate: '',
            endDate: '',
            user: '',
        });
        const [highlightedRow, setHighlightedRow] = useState(null);
        const [isEditing, setIsEditing] = useState(false);
        const [editingIndex, setEditingIndex] = useState(null);
        const [editData, setEditData] = useState({});
        
        const handleSearchFormChange = (e) => {
            const { name, value } = e.target;
            setSearchData(prev => ({ ...prev, [name]: value }));
        };

        const handleSearchSubmit = (e) => {
            e.preventDefault();

            if (searchData.startDate == "") { 
                showAlert('error', 'Error', 'Please select both Task and Type.');
                return;
            }
            if (searchData.endDate == "") { 
                showAlert('error', 'Error', 'Please select both Task and Type.');
                return;
            }
            
            fetchReports();
        };

        const handleModifyClick = (index) => {

            setIsEditing(true);
            setEditingIndex(index);
            setHighlightedRow(index);
            let previous_selectedRow = "";
            let selectedRow = "";
            let follow_selectedRow = "";

            if(index == 0){
                previous_selectedRow = null;
                selectedRow = dataRows_Report[index];
                follow_selectedRow = dataRows_Report[index + 1];
            }else if (index < (dataRows_Report.length - 1)){
                previous_selectedRow = dataRows_Report[index - 1];
                selectedRow = dataRows_Report[index];
                follow_selectedRow = dataRows_Report[index + 1];
            }else if (index == (dataRows_Report.length - 1)){
                previous_selectedRow = dataRows_Report[index - 1];
                selectedRow = dataRows_Report[index];
                follow_selectedRow = null;
            }
    
            // Separar fecha y hora para start_time y end_time
            const [startDate, startTime] = selectedRow.start_time.split(' ');
            const [endDate, endTime] = selectedRow.end_time.split(' ');
        
            // Actualizar editData con los valores separados
            setEditData({
                ...selectedRow,
                start_date: startDate,
                start_time: startTime, 
                end_date: endDate, 
                end_time: endTime,
                pre_row_id: previous_selectedRow ? previous_selectedRow.id : null,
                pre_row_end_time: previous_selectedRow ? previous_selectedRow.end_time : null,
                pre_row_start_time: previous_selectedRow ? previous_selectedRow.start_time : null,
                next_row_id: follow_selectedRow ? follow_selectedRow.id : null,
                next_row_star_time: follow_selectedRow ? follow_selectedRow.start_time : null,
                next_row_end_time: follow_selectedRow ? follow_selectedRow.end_time : null,
            });
        
            // Obtener el id de la tarea
            const task = taskOptionsByRole.find(task => task.task_name === selectedRow.task_name);
            const task_id = task ? task.id : null;
        
            fetchTaskType(task_id);
        };
        

        const fetchTaskType = async (task_id) => {
            try {
                const res = await fetch('/api/TL/manage_times_types', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ task_id: task_id }), 
                });
                const data = await res.json();        
                if (data.success) {
                    setAvailableTypeOptions(data.types);
                } else {
                    console.error('Error fetching types:', data.message);
                }
            } catch (error) {
                console.error('Error fetching types:', error);
            }
        };

        const fetchTask = async () => {
            if (localStorage.getItem('userEmail')) {
                try {
                    // Hacer una sola solicitud para obtener el rol y las tareas asociadas
                    const res = await fetch('/api/TL/manage_times_tasks', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ }),
                    });
                    const data = await res.json();
                    if (data.success) {
                        setTaskOptionsByRole(data.tasks);   
                     
                    } else {
                        console.error('Failed to fetch role and tasks:', data.message);
                    }
                } catch (error) {
                    console.error('Error fetching role and tasks:', error);
                }
            }
        };

        useEffect(() => {
            fetchTask(); 
        }, []);

        const handleEditFormChange = (e) => {
            const { name, value } = e.target;
            setEditData((prevState) => ({
                ...prevState,
                [name]: value || "",
            })); 
        };
        

        const handleEditSubmit = (e) => {
            e.preventDefault();
        
            // Validar que el alias tenga 5 caracteres si task es "Production"
            if (editData.task_id == 1 && editData.alias.length !== 5) {
                showAlert('error', 'Error', 'Please, the alias must be 5 characters long.');
                return;
            }
        
            // Validar que el campo de comentarios no esté vacío si type es 'Other'

            if ((editData.type_id == 57 || editData.type_id == 58 || editData.type_id == 59) && !editData.comments) {
                showAlert('error', 'Error', 'Please fill in the comments when selecting "Other".');
                return;
            }
            
            // Concatenar fecha y hora para crear objetos `Date`
            const startTime = new Date(`${editData.start_date} ${editData.start_time}`);
            const endTime = new Date(`${editData.end_date} ${editData.end_time}`);

            // Verificar que `startTime` sea menor que `endTime`
            if (startTime >= endTime) {
                showAlert('error', 'Error', 'The start time must be earlier than the end time.');
                return;
            }

            // Calcular el tiempo transcurrido
            const timeDifference = endTime - startTime;
            
            const elapsedMinutes = Math.floor(timeDifference / 60000);

            // Formatear las fechas en el formato `YYYY-MM-DD HH:MM:SS`
            const formattedStartTime = formatDateTime(startTime);
            const formattedEndTime = formatDateTime(endTime);

            const updatedData = {
                task_id: editData.task_id,
                type_id: editData.type_id,
                alias: editData.alias,
                commment: editData.commment,
                row_status: editData.row_status,
                start_time: formattedStartTime, 
                end_time: formattedEndTime,     
                totalTime: elapsedMinutes,
                role_id: editData.role_id,
                pre_row_id: editData.pre_row_id,
                pre_row_time: editData.pre_row_time,
                next_row_id: editData.next_row_id,
                pre_row_end_time: editData.pre_row_end_time,
                pre_row_start_time:  editData.pre_row_start_time,
                next_row_star_time: editData.next_row_star_time,
                next_row_end_time: editData.next_row_end_time,
            };

            update_data(editData.id,updatedData);
        
            // Resetear el estado de edición
            setIsEditing(false);
            setEditingIndex(null);
            setEditData({});
            setHighlightedRow(null);
            
        };
        
        const handleCancelClick = () => {
            setIsEditing(false); // Oculta el formulario al hacer clic en "Cancel"
            setHighlightedRow(null);
        };

        const formatDateTime = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes en dos dígitos
            const day = String(date.getDate()).padStart(2, '0'); // Día en dos dígitos
            const hours = String(date.getHours()).padStart(2, '0'); // Horas en dos dígitos
            const minutes = String(date.getMinutes()).padStart(2, '0'); // Minutos en dos dígitos
            const seconds = String(date.getSeconds()).padStart(2, '0'); // Segundos en dos dígitos
        
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        };
        

        const getStatusOptions = () => {
            return ['Finish', 'Stop'] || [];
        };

        const fetchTechList = async () => {
        
            const tl = localStorage.getItem('user_name');
            try {
                const res = await fetch('/api/TL/manage_times', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ tl_user_name: tl }), 
                });
                const data = await res.json();        
                if (data.success) {
                    setTL_Technitians(data.users);
                } else {
                    console.error('Error fetching types:', data.message);
                }
            } catch (error) {
                console.error('Error fetching types:', error);
            }
        };

        useEffect(() => {
            fetchTechList();
        },[]);
        
        const fetchReports = async () => {
            const user_id = searchData.user;
            const startDate = searchData.startDate;
            const endDate = searchData.endDate;
            try {
                const response = await fetch('/api/TL/search_report', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id, startDate, endDate}),
                });                       
                const result = await response.json();      
                if (result.success) {
                    const data = result.reports;
                    setDataRows_Report(data); 
                } else {
                    alert(result.message || "Error al actualizar la tabla.");
                }
            } catch (error) {
                console.error(error);
                alert("Error en la conexión.");
            }
        };

        useEffect(() => {
            if (TL_Technitians.length > 0) {
                setSearchData(prevData => ({ ...prevData, user: TL_Technitians[0].id }));
            }
        }, [searchData.startDate, searchData.endDate]);

        const update_data = async (id, updatedData) => {

            try {
                const res = await fetch('/api/TL/manage_times_update', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ row_id: id, data: updatedData }), 
                });
                const data = await res.json();        
                if (data.success) {
                    showAlert('success', 'Update', 'The register was updated successfully.');
                    fetchReports();
                } else {
                    console.error('Error fetching types:', data.message);
                }
            } catch (error) {
                console.error('Error fetching types:', error);
            }
        };


    //#endregion

    //#region Code for role managing

        /*********************************************************************************************/
        /***                    All The Validations needed for managing roles                      ***/
        /*********************************************************************************************/

            // Lista de técnicos
            const technicians = [
                "Tech #1", "Tech #2", "Tech #3", "Tech #4", 
                "Tech #5", "Tech #6", "Tech #7", "Tech #8", 
                "Tech #9", "Tech #10", "Tech #11", "Tech #12"
            ];

            // Estado para los roles de cada técnico
            const [roles, setRoles] = useState(
                technicians.map(name => ({
                    name,
                    OTP: true,
                    Clinical_Ops: false,
                    Clinical_Exc: false,
                    Ortho: false,
                    QC_OTP: false,
                    Detailer_Finisher: false,
                    Clinical_Analyst: false,
                    CAD: false,
                }))
            );

            // Manejar el cambio de checkbox para un técnico específico
            const handleCheckboxChange = (technicianIndex, role) => {
                const updatedRoles = [...roles];

                // Deseleccionar todos los roles de ese técnico
                Object.keys(updatedRoles[technicianIndex]).forEach(r => {
                    if (r !== 'name') updatedRoles[technicianIndex][r] = false;
                });

                // Seleccionar solo el rol actual
                updatedRoles[technicianIndex][role] = true;
                
                setRoles(updatedRoles);
            };

            // Manejar el cambio de checkbox del encabezado
            const handleHeaderCheckboxChange = (role) => {
                const updatedRoles = roles.map(tecnico => {
                    const newRoles = { ...tecnico };
                    
                    // Deseleccionar todos los roles de este técnico
                    Object.keys(newRoles).forEach(r => {
                        if (r !== 'name') newRoles[r] = false;
                    });

                    // Seleccionar el rol actual
                    newRoles[role] = true;
                    
                    return newRoles;
                });

                setRoles(updatedRoles);
            };

            // Guardar cambios
            const saveChanges = () => {
                console.log("Datos guardados:", roles);
                showAlert('success', 'Role Change', 'The role was updated successfully.');
            };

    //#endregion

    //#region Code for report

        /*********************************************************************************************/
        /***                             Report and data for grafics                               ***/
        /*********************************************************************************************/

        const fetchDailyReportsTl = async () => {
        const currentDate = new Date().toISOString().slice(0, 10).replace('T', ' '); // Formato YYYY-MM-DD
        const tl_name = localStorage.getItem('user_name');
        try {
            const response = await fetch('/api/TL/report_tl', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tl_name, currentDate }),
            });

            const result = await response.json();

            if (result.success) {
                const data = result.reports;
                setDataRows(data);

                // Obtener nombres únicos y contar casos por cada técnico
                const uniqueUsers = Array.from(new Set(data.map(item => item.user_name)));
                const caseCounts = uniqueUsers.map(user => 
                    data.filter(item => item.user_name === user).length
                );

                // Crear datos dinámicos para el gráfico
                const dynamicIndividualData = {
                    labels: uniqueUsers,
                    datasets: [
                        {
                            label: 'Cases per Technician',
                            data: caseCounts,
                            backgroundColor: techColors.slice(0, uniqueUsers.length),
                            borderColor: techColors.slice(0, uniqueUsers.length).map(color => color.replace('0.6', '1')),
                            borderWidth: 1,
                        },
                    ],
                };
                setIndividualData(dynamicIndividualData);

                const uniqueType = Array.from(new Set(data.map(item => item.type_value)));
                const taskCounts = uniqueType.map(task =>
                    data.filter(item => item.type_value === task).length
                );

                // Crear datos dinámicos para el gráfico
                const dynamicGroupData = {
                    labels: uniqueType,
                    datasets: [
                        {
                            label: 'Tasks per Type',
                            data: taskCounts,
                            backgroundColor: taskColors.slice(0, uniqueType.length),
                            borderColor: taskColors.slice(0, uniqueType.length).map(color => color.replace('0.6', '1')),
                            borderWidth: 1,
                        },
                    ],
                };

                // Actualizar el estado del gráfico
                setGroupData(dynamicGroupData);


                // Sumar el tiempo total de "Idle_Time" para cada usuario
                const idleTimeCounts = uniqueUsers.map(user => {
                    // Filtrar registros que corresponden a "Idle_Time" y al usuario actual
                    const idleTimeRecords = data.filter(
                        item => item.user_name === user && item.task_name === "Idle_Time"
                    );

                    // Sumar el tiempo total para este usuario en "Idle_Time"
                    const totalIdleTime = idleTimeRecords.reduce((sum, record) => {
                        // Convertir total_time a número entero y sumar
                        return sum + parseInt(record.total_time, 10);
                    }, 0);

                    return totalIdleTime;
                });

                // Crear datos dinámicos para el gráfico
                const dynamicIndividualData_Idle_Time = {
                    labels: uniqueUsers,
                    datasets: [
                        {
                            label: 'Total Idle Time per Technician',
                            data: idleTimeCounts,
                            backgroundColor: techColors.slice(0, uniqueUsers.length),
                            borderColor: techColors.slice(0, uniqueUsers.length).map(color => color.replace('0.6', '1')),
                            borderWidth: 1,
                        },
                    ],
                };

                // Actualizar el estado del gráfico
                setIndividualData_Idle_Time(dynamicIndividualData_Idle_Time);

            } else {
                alert(result.message || "Error al actualizar la tabla.");
            }
        } catch (error) {
            console.error(error);
            alert("Error en la conexión.");
        }
    };
        
        useEffect(() => {
            fetchDailyReportsTl(); 
        }, []);

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
                            className={`${styles.optionButton} ${selectedOption === 'Today Team Work' ? styles.activeOption : ''}`}
                            onClick={() => handleOptionChange('Today Team Work')}
                        >
                            Today's Teamwork
                        </button>
                        <button
                            className={`${styles.optionButton} ${selectedOption === 'Manage Times' ? styles.activeOption : ''}`}
                            onClick={() => handleOptionChange('Manage Times')}
                        >
                            Manage Times
                        </button>
                        <button
                            className={`${styles.optionButton} ${selectedOption === 'Role Management' ? styles.activeOption : ''}`}
                            onClick={() => handleOptionChange('Role Management')}
                        >
                            Role Management
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
                {selectedOption === 'Today Team Work' && !showPasswordChangeForm && (
                    <div className={styles.mainContent}>
                        <div className={styles.formSection}>
                        {/* Weekly Production Section */}
                        <div className={styles.timerSection}>
                            <h2>Current Individual Production</h2>
                            <Bar data={individualData} options={current_production_ChartOptions} />
                        </div>
                        </div>
                        <div className={styles.chartSection}>
                            <h2>Current Production Report by Task</h2>
                            <Bar data={groupData} options={group_ChartOptions} />
                        </div>
                        {/* Weekly Production Section */}
                        <div className={styles.timerSection}>
                            {/* Weekly Production Section */}
                            <div className={styles.timerSection}>
                                <h2>Idle Time Report</h2>
                                <Bar data={individualData_Idle_Time} options={current_Idle_Time_ChartOptions} />
                            </div>
                        </div>       
                    </div>
                )}
                {selectedOption === 'Today Team Work' && !showPasswordChangeForm && (
                    <div className={styles.tableSection}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Technician</th>
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
                                            <td>{row.user_name}</td>
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
                {selectedOption === 'Manage Times' && !showPasswordChangeForm && (
                    <div className={styles.container_searchForm}>
                        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                            <div className={styles.searchForm}> {/* Cambiado a className */}
                                <label htmlFor="startDate" className={styles.searchLabel}> {/* Cambiado a htmlFor */}
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    value={searchData.startDate}
                                    onChange={handleSearchFormChange}
                                    className={styles.searchInput} 
                                />
                                <label htmlFor="endDate" className={styles.searchLabel}> {/* Cambiado a htmlFor */}
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    value={searchData.endDate}
                                    onChange={handleSearchFormChange}
                                    className={styles.searchInput} 
                                />
                                <label htmlFor="technician" className={styles.searchLabel}> {/* Cambiado a htmlFor */}
                                    Select Technician
                                </label>

                                <select id="technician" name="user" value={searchData.id} onChange={handleSearchFormChange} className={styles.searchInput}>
                                    {TL_Technitians.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.user_name}
                                        </option>
                                    ))}
                                </select>
                                <button type="submit" className={styles.searchButton}>Search</button>
                            </div>
                        </form>
                    </div>
                )}
                {/* Tabla con los campos especificados */}
                {selectedOption === 'Manage Times' && !showPasswordChangeForm && (
                    <div className={styles.container}>
                        <div className={`${styles.tableContainer} ${isEditing ? styles.shrinkTable : ''}`}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Date</th>                         
                                        <th>Technician</th>                               
                                        <th>Task</th>
                                        <th>Type</th>
                                        <th>Alias</th>
                                        <th>Comments</th>
                                        <th>Status</th>
                                        <th>Start Time</th>
                                        <th>End Time</th>
                                        <th>Total Time</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {Array.isArray(dataRows_Report) && dataRows_Report.length > 0 ? (
                                    dataRows_Report.map((row, index) => (
                                        <tr
                                            key={index}
                                            style={{ backgroundColor: index === highlightedRow ? '#f0f8ff' : 'transparent' }} 
                                        >
                                            <td>{row.id}</td>
                                            <td>{row.row_date.split('T')[0]}</td>
                                            <td>{row.user_name}</td>                        
                                            <td>{row.task_name}</td>
                                            <td>{row.type_value}</td>
                                            <td>{row.alias}</td>
                                            <td>{row.commment}</td>
                                            <td>{row.row_status}</td>
                                            <td>{row.start_time}</td> 
                                            <td>{row.end_time}</td> 
                                            <td>{row.total_time + ' min'}</td> 
                                            <td>{row.role_name}</td>
                                            <td>
                                                <button onClick={() => handleModifyClick(index)}>Modify</button>
                                            </td>
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

                        {isEditing && (
                            <div className={styles.editFormContainer}> 
                                <form onSubmit={handleEditSubmit}>
                                    <h3>Edit Row</h3>
                                    <input 
                                        type="text"
                                        name="user_name"
                                        value={editData.user_name}
                                        onChange={handleEditFormChange}
                                        placeholder="Technician"
                                        disabled
                                        className={styles.searchInput} // Clase para los estilos
                                    />
                                    <select 
                                        name="task_id"
                                        value={editData.task_id}
                                        onChange={handleEditFormChange}
                                        className={styles.editList} // Clase para los estilos
                                    >
                                        {taskOptionsByRole.map(task => (
                                            <option key={task.id} value={task.id}>
                                            {task.task_name}
                                        </option>
                                        ))}
                                    </select>
                                    <select 
                                        name="type_id"
                                        value={editData.type_id}
                                        onChange={handleEditFormChange}
                                        className={styles.editList} // Clase para los estilos
                                    >
                                        {AvailableTypeOptions.map(type => (
                                            <option key={type.id} value={String(type.id)}>
                                                {type.type_value}
                                            </option>
                                        ))}
                                    </select>
                                    {/* Mostrar alias solo si task es "Production" */}
                                    {editData.task_name === 'Production' && (
                                        <input 
                                            type="text"
                                            name="alias"
                                            value={editData.alias}
                                            onChange={handleEditFormChange}
                                            placeholder="Alias"
                                            className={styles.searchInput} // Clase para los estilos
                                        />
                                    )}
                                    <input 
                                        type="text"
                                        name="comments"
                                        value={editData.comments}
                                        onChange={handleEditFormChange}
                                        placeholder="Comments"
                                        className={styles.searchInput} // Clase para los estilos
                                    />
                                    <select 
                                        name="row_status" // Asegúrate de que el nombre sea "status" aquí
                                        value={editData.row_status}
                                        onChange={handleEditFormChange}
                                        className={styles.editList} // Clase para los estilos
                                    >
                                        {getStatusOptions().map((typeObj, index) => (
                                            <option key={index} value={typeObj}>
                                                {typeObj}
                                            </option>
                                        ))}
                                    </select>

                                    <input
                                        type="text"
                                        name="start_time"
                                        value={editData.start_time} // Solo la parte de la hora
                                        onChange={handleEditFormChange}
                                        placeholder="Start Time"
                                        required
                                        className="searchInput" // Puedes aplicar tus estilos aquí
                                        maxLength={8} // Limita la longitud a 8 caracteres (hh:mm:ss)
                                        pattern="([01]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])" // Formato de hora
                                    />

                                    <input
                                        type="text"
                                        name="end_time"
                                        value={editData.end_time} // Solo la parte de la hora
                                        onChange={handleEditFormChange}
                                        placeholder="End Time"
                                        required
                                        className="searchInput" 
                                        maxLength={8} 
                                        pattern="([01]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])" 
                                    />
                                    <button type="submit" className={styles.editButton}>Save Changes</button> 
                                    <button type="button" onClick={handleCancelClick} className={styles.cancel_Edit_Button}>Cancel</button>
                                </form>
                            </div>
                        )}
                    </div>
                )}
                {selectedOption === 'Role Management' && !showPasswordChangeForm && (
                    <div id="container_roll" className={styles.container_roll}>
                    <h2>Role Management</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Técnico</th>
                                {['OTP', 'Clinical_Ops', 'Clinical_Exc', 'Ortho', 'QC_OTP', 'Detailer_Finisher', 'Clinical_Analyst', 'CAD'].map(role => (
                                    <th key={role}>
                                        <div style={{ textAlign: 'center' }}>
                                            {role}<br />
                                            <input 
                                                type="checkbox" 
                                                checked={roles.every(tecnico => tecnico[role])} 
                                                onChange={() => handleHeaderCheckboxChange(role)} 
                                            />
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((tecnico, index) => (
                                <tr key={tecnico.name}>
                                    <td>{tecnico.name}</td>
                                    {['OTP', 'Clinical_Ops', 'Clinical_Exc', 'Ortho', 'QC_OTP', 'Detailer_Finisher', 'Clinical_Analyst', 'CAD'].map(role => (
                                        <td key={role}>
                                            <input 
                                                type="checkbox" 
                                                checked={tecnico[role]} 
                                                onChange={() => handleCheckboxChange(index, role)} 
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={saveChanges} className={styles.saveButton}>Save Changes</button>
                </div>
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
            </main>
        </div>
    );
}
