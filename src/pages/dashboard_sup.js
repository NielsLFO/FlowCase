import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import { FaCog } from 'react-icons/fa'; 
import styles from '../styles/dashboard_sup.module.css';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useRouter } from 'next/router';

import Select from "react-select"; // npm install react-select
import DatePicker from "react-datepicker"; // npm install react-datepicker
import "react-datepicker/dist/react-datepicker.css";
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register components for the chart
ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    ArcElement,
    ChartDataLabels
);

export default function Dashboard() {

    //#region Session  

 
        const router = useRouter();
/*
        const INACTIVITY_LIMIT = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
        
        const handleUserActivity = () => {
            // Update the time of the last activity
            sessionStorage.setItem('lastActivity', Date.now());
        };
        
        const checkInactivity = () => {
            const lastActivity = sessionStorage.getItem('lastActivity');
            if (lastActivity) {
                const currentTime = Date.now();
                const timeSinceLastActivity = currentTime - parseInt(lastActivity, 10);
        
                // If more than 4 hours have passed, redirect to the home page
                if (timeSinceLastActivity > INACTIVITY_LIMIT) {
                    performSignOut();
                }
            }
        };
        
        useEffect(() => {
            // Check if the user is authenticated
            const userEmail = sessionStorage.getItem('userEmail');
            const role = sessionStorage.getItem('roleId');
            if (!userEmail || role !== "10") {
                alert(role);
                router.push('/');
            }
        
            // Set up events to track user activity
            window.addEventListener('mousemove', handleUserActivity);
            window.addEventListener('keydown', handleUserActivity);
        
            // Start the interval to check for inactivity
            const interval = setInterval(checkInactivity, 60 * 1000); // Check every minute
        
            // Clean up events and interval when the component unmounts
            return () => {
                window.removeEventListener('mousemove', handleUserActivity);
                window.removeEventListener('keydown', handleUserActivity);
                clearInterval(interval);
            };
        }, [router]);
*/
    //#endregion

    //#region States 
        /*********************************************************************************************/
        /***                                    state variables                                    ***/
        /*********************************************************************************************/
        const [selectedOption, setSelectedOption] = useState('Roster');
        const [showPasswordChangeForm, setShowPasswordChangeForm] = useState(false);
        const [dataRows, setDataRows] = useState();
        const [differenceInDays, setdifferenceInDays] = useState();
        const [dataRows_Report, setDataRows_Report] = useState();
        const [dataRows_Overtime, setDataRows_Overtime] = useState();
        const [dataRows_Open_Rows, setDataRows_Open_Rows] = useState();
        const [TL_Technitians, setTL_Technitians] = useState([]);
        const [taskOptionsByRole, setTaskOptionsByRole] = useState([]);
        const [AvailableTypeOptions, setAvailableTypeOptions] = useState([]);
        const [highlightedRow, setHighlightedRow] = useState(null);
        const [passwordChangeData, setPasswordChangeData] = useState({
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
        const [filters, setFilters] = useState({
            technician: '',
            task: '',
            type: '',
            alias: '',
            status: ''
        });
        // State for the Snackbar and the alert
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

        const handleOptionChange = (option) => {
            setSelectedOption(option);
            setShowPasswordChangeForm(false);
            if(option == "Role Management"){
                loadRolesAndTechnicians();
            }else if (option == "Today Team Work"){
                fetchDailyReportsTl();
            }
        };
        const handleSettingsButtonClick  = async (e) => {
            
            setShowPasswordChangeForm(prev => !prev);
            
            // If the form is already shown, select "Today Work"
            if (showPasswordChangeForm) {
                setSelectedOption('Today Work');

            } else {
                setSelectedOption(''); // Clear option when opening the settings form
            }
        };

        const handleChangePassword = async (e) => {
            e.preventDefault();           
            try {
                const user_name = sessionStorage.getItem('user_name');
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

        const handleChangePasswordCancel = async (e) => {          
            setPasswordChangeData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            });       
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
        const handleSignOut = () => {
            performSignOut();
        };

        const performSignOut = () => {
            sessionStorage.clear();
            console.log('User signed out');
            router.push('/'); // Redirige al inicio
        };

    //#endregion

    //#region Report Analisis
        /*********************************************************************************************/
        /***                                        Report                                         ***/
        /*********************************************************************************************/
        const [activeTab_report, setActiveTab_report] = useState('Audit');
        const [auditData, setAuditData] = useState([]);

        const fetchAuditData = async () => {
            const tl_name = sessionStorage.getItem("user_name"); 
            try {
                const response = await fetch('/api/TL/get_audit_report', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ tl_name: tl_name }),  // Enviamos el tl_name como parte del cuerpo de la solicitud
                });
        
                const result = await response.json();
        
                if (result.success) {
                    // Procesamos los datos obtenidos
                    setAuditData(result.data); 
                } else {
                    console.error(result.message || 'Error loading audit data.');
                }
            } catch (error) {
                console.error('Error fetching audit data:', error);
            }
        };


        const groupedData = auditData.reduce((acc, entry) => {
            if (!acc[entry.tech]) {
                acc[entry.tech] = [];
            }
            acc[entry.tech].push(entry);
            return acc;
        }, {});
        

    //#endregion

    const [searchData, setSearchData] = useState({
        startDate: '',
        endDate: '',
        id: '',
    });

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
        
        fetchIdle_time();
    };


    let totalHours = 0; // Total de horas por persona
    let idleHours = 0; // Supongamos que totalIdleTime está en minutos


    const [Data_Idel_Time, setData_Idel_Time] = useState({
        totalIdleTime: 0,
        totalHours: 0,
        idleHours: 0,
        workedHours: 0
    });

   

    const handleSearchFormChange = (e) => {
        const { name, value } = e.target;
        setSearchData(prev => ({ ...prev, [name]: value }));

    };

    const DoughnutChart = ({ workedHours, idleHours }) => {
        const data = {
          labels: ['Worked Hours', 'Idle Hours'],
          datasets: [
            {
              data: [workedHours, idleHours],
              backgroundColor: ['#36A2EB', '#FF6384'],
              hoverBackgroundColor: ['#36A2EB', '#FF6384'],
            },
          ],
        };
      
        const options = {
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return `${tooltipItem.label}: ${tooltipItem.raw} Hrs`;
                },
              },
            },
            datalabels: {
              color: '#fff', // Color del texto
              formatter: (value) => `${value} Hrs`, // Formato de las etiquetas
              font: {
                size: 14, // Tamaño de la fuente
                weight: 'bold',
              },
              anchor: 'end',
              align: 'start',
              offset: 5, // Ajusta la posición
            },
          },
        };
      
        return (
          <div style={{ width: '100%', height: '300px' }}>
            <Doughnut data={data} options={options} />
          </div>
        );
      };

    const taskColors = [
        'rgba(66, 135, 245, 0.6)',  
        'rgba(255, 166, 0, 0.6)',   
        'rgba(231, 76, 60, 0.6)',  
    ];

    // State for the task chart data
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

       // Options for the chart
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
        scales: {
            x: {
                ticks: {
                    autoSkip: false, // Muestra todas las etiquetas
                    maxRotation: 45, // Rotación máxima de las etiquetas (puedes ajustar este valor)
                    minRotation: 0, // Rotación mínima de las etiquetas
                    align: 'center', // Centra las etiquetas bajo las marcas del eje
                },
            },
        },
    };
    // Data for the individual production chart
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
    // Options for the chart
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

    const fetchIdle_time = async () => {
        const user_id = searchData.id;
        const startDate = searchData.startDate;
        const endDate = searchData.endDate;

        // Transformar las fechas en objetos Date
        const start = new Date(searchData.startDate);
        const end = new Date(searchData.endDate);

        // Calcular la diferencia en milisegundos
        const differenceInMilliseconds = end - start;

        // Calcular la cantidad de días
        let differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
        setdifferenceInDays(Math.ceil(differenceInDays) + 1);
     
        try {
            const response = await fetch('/api/Supervisor/total_Idle_time', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id, startDate, endDate }),
            });                       
            const result = await response.json();      
            if (result.success) {
                const data = result.reports;
                const data2 = result.types;
                setDataRows_Report(data); 
                setDataRows(data); 
                let totalIdleTime = 0;
                for (let index = 0; index < data.length; index++) {
                    totalIdleTime += parseInt(data[index].total_time) ; 
                } 
                setData_Idel_Time({
                    totalIdleTime: totalIdleTime,
                    totalHours:  totalHours = data.length * 9,
                    idleHours: (totalIdleTime / 60).toFixed(1),
                    workedHours: totalHours - idleHours,
                });

                // Map the data returned by the query directly
                const idleTimeCounts = data.map(record => {
                    // Extract the total time directly from the record
                    const totalIdleTime = (record.total_time / 60).toFixed(1); 
                    return totalIdleTime;
                });

                // Extract unique user names from the data
                const uniqueUsers = data.map(record => record.user_name);

                // Create dynamic data for the chart
                const dynamicIndividualData_Idle_Time = {
                    labels: uniqueUsers, // Use user names as labels
                    datasets: [
                        {
                            label: 'Total Hrs',
                            data: idleTimeCounts, // Use the precomputed idle time values
                        },
                    ],
                };

                // Update the chart state
                setIndividualData_Idle_Time(dynamicIndividualData_Idle_Time);

                // Map the data returned by the query directly
                const idleTimeCounts_type = data2.map(record => {
                    // Extract the total time directly from the record
                    const totalIdleTime = (record.total_time / 60).toFixed(1); 
                    return totalIdleTime;
                });

                // Extract unique user names from the data
                const uniqueType = data2.map(record => record.type_value);

                // Create dynamic data for the chart
                const dynamicIndividualData_Idle_Time_type = {
                    labels: uniqueType, // Use user names as labels
                    datasets: [
                        {
                            label: 'Total Hrs',
                            data: idleTimeCounts_type, // Use the precomputed idle time values
                        },
                    ],
                };
                // Update the chart state
                setGroupData(dynamicIndividualData_Idle_Time_type);
            } else {
                alert(result.message || "Error al actualizar la tabla.");
            }
        } catch (error) {
            console.error(error);
            alert("Error en la conexión.");
        }

    };




            // Filtrar los datos según los filtros establecidos
            const filteredData = Array.isArray(dataRows) ? dataRows.filter((row) => {
                return (
                    (filters.technician === '' || row.user_name.toLowerCase().includes(filters.technician.toLowerCase())) &&
                    (filters.task === '' || row.task_name.toLowerCase().includes(filters.task.toLowerCase())) &&
                    (filters.type === '' || row.type_value.toLowerCase().includes(filters.type.toLowerCase())) &&
                    (filters.alias === '' || row.alias.toLowerCase().includes(filters.alias.toLowerCase())) &&
                    (filters.status === '' || row.row_status.toLowerCase().includes(filters.status.toLowerCase()))
                );
            }) : [];

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <nav className={styles.nav}>
                    <div className={styles.leftOptions}>
                        <button
                            className={`${styles.optionButton} ${selectedOption === 'Roster' ? styles.activeOption : ''}`}
                            onClick={() => handleOptionChange('Roster')}
                        >
                            Roster
                        </button>
                        <button
                            className={`${styles.optionButton} ${selectedOption === 'Idle Time' ? styles.activeOption : ''}`}
                            onClick={() => handleOptionChange('Idle Time')}
                        >
                            Idle Time
                        </button>
                        <button
                            className={`${styles.optionButton} ${selectedOption === 'Management' ? styles.activeOption : ''}`}
                            onClick={() => handleOptionChange('Management')}
                        >
                            Management
                        </button>
                        <button
                            className={`${styles.optionButton} ${selectedOption === 'Overtime' ? styles.activeOption : ''}`}
                            onClick={() => handleOptionChange('Overtime')}
                        >
                            Overtime
                        </button>
                        <button
                            className={`${styles.optionButton} ${selectedOption === 'Reports' ? styles.activeOption : ''}`}
                            onClick={() => handleOptionChange('Report')}
                        >
                            Report 
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
                {/* Snackbar to display the alert message */}
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
                {selectedOption === 'Roster' && !showPasswordChangeForm && (
                    <div className="tabs-container">
                        <div className={styles.tableSection}>
                            <button
                                className={activeTab_report === 'New Employee' ? `${styles.tab} ${styles.active}` : styles.tab}
                                onClick={() => {
                                    setActiveTab_report('New Employee');  
                                    //fetchAuditData();
                                }}
                            >
                                New Employee
                            </button>
                            <button
                                className={activeTab_report === 'Modify Employee' ? `${styles.tab} ${styles.active}` : styles.tab}
                                onClick={() => {
                                    setActiveTab_report('Modify Employee');  
                                    //fetchOpenRows();
                                }}
                            >
                                Modify Employee
                            </button>
                            <button
                                className={activeTab_report === 'Disable Employee' ? `${styles.tab} ${styles.active}` : styles.tab}
                                onClick={() => {
                                    setActiveTab_report('Disable Employee');  
                                    //fetchOpenRows();
                                }}
                            >
                                Disable Employee
                            </button>
                        </div>
                        {/* Contenido de las pestañas */}
                        <div className="tab-content">
                            {activeTab_report === 'New Employee' && (
                                <div id="newUserFormContainer" className={styles.newUserFormContainer}>
                                    <h2 className={styles.newUserFormTitle}>New User Form</h2>
                                    <form className={styles.newUserForm}>
                                        <div className={styles.formGroup}>
                                            <label>Name:</label>
                                            <input type="text" placeholder="Enter name" />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Email:</label>
                                            <input type="email" placeholder="Enter email" />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Jira ID:</label>
                                            <input type="text" placeholder="Enter Jira ID" />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Slack ID:</label>
                                            <input type="text" placeholder="Enter Slack ID" />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Country:</label>
                                            <select>
                                                <option value="CR">CR</option>
                                                <option value="UKR">UKR</option>
                                                <option value="USA">USA</option>
                                            </select>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Role:</label>
                                            <select>
                                                <option value="CAD">CAD</option>
                                                <option value="Engineer">Engineer</option>
                                            </select>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Team Name:</label>
                                            <input type="text" placeholder="Agate" />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Leader:</label>
                                            <select>
                                                <option value="Abisag Morales">Abisag Morales</option>
                                            </select>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Supervisor:</label>
                                            <select>
                                                <option value="Adrian Jimenez">Adrian Jimenez</option>
                                            </select>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>LFO Start Date:</label>
                                            <input type="date" />
                                        </div>

                                        <button type="submit" className={styles.submitButton}>Submit</button>
                                    </form>
                                </div>
                            )}
                        </div> 
                    </div>
                )}
                {selectedOption === 'Idle Time' && !showPasswordChangeForm && (
                    <div>
                    <div className={styles.container_searchForm}>
                    <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                        <div id={styles.searchFormContainer}>
                            <div className="searchFormGroup">
                                <label htmlFor="customStartDate" className="searchLabel">Start Date </label>
                                <input
                                type="date"
                                id="customStartDate"
                                name="startDate"
                                value={searchData.startDate}
                                onChange={handleSearchFormChange}
                                className={styles.searchInput}
                                />
                            </div>

                            <div className="searchFormGroup">
                                <label htmlFor="customEndDate" className="searchLabel">End Date </label>
                                <input
                                type="date"
                                id="customEndDate"
                                name="endDate"
                                value={searchData.endDate}
                                onChange={handleSearchFormChange}
                                className= {styles.searchInput}
                                />
                            </div>

                            <div className="searchFormGroup">
                                <label htmlFor="customSelectPPRSM" className="searchLabel">Select PPRSM </label>
                                <select
                                id="customSelectPPRSM"
                                name="id"
                                value={searchData.id}
                                onChange={handleSearchFormChange}
                                className={styles.searchSelect}
                                >
                                <option key="0" value="00">Select PPRSM</option>
                                <option key="9" value="9">German.Gonzalez</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className={styles.searchButton}
                                id="customSearchButton"
                            >
                                Search
                            </button>
                        </div>
                    </form>
                    <div className={styles.mainContent}>
                        <div className={styles.formSection}>
                          <div className={styles.timerSection}>
                            <h2 className={styles.sectionTitle}>Worked Hours vrs Idle Hours</h2>
                            <DoughnutChart workedHours={Data_Idel_Time.workedHours} idleHours={Data_Idel_Time.idleHours}/>
                          </div>
                        </div>
                        <div className={styles.chartSection}>
                          <h2 className={styles.sectionTitle}>Individual Total Idle Time</h2>
                          <Bar data={individualData_Idle_Time} options={current_Idle_Time_ChartOptions}/>
                        </div>
                        <div className={styles.timerSection}>
                          <h2 className={styles.sectionTitle}>Idle Time by Task</h2>
                          <Bar data={groupData} options={group_ChartOptions}/>
                        </div>
                    </div>
                </div>
                </div>
                )}
                {selectedOption === 'Idle Time' && !showPasswordChangeForm && (
                    <div className={styles.tableSection}>
                        <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Technician</th>
                                <th>Effective Worked Hours</th>
                                <th>Total Idle Time</th>
                                <th>Day Efficiency</th>
                                <th>Hour Efficiency</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((row, index) => (
                                    <tr
                                        key={index}
                                        style={{ backgroundColor: index === highlightedRow ? '#f0f8ff' : 'transparent' }}
                                    >
                                        <td>{row.user_name}</td>
                                        <td>{(differenceInDays * 9).toFixed(1) + ' h'}</td>
                                        <td>{(row.total_time / 60).toFixed(1) + ' h'}</td>
                                        <td>
                                            {(
                                                (((differenceInDays * 9) - (row.total_time / 60)) / (differenceInDays * 9)) * 100
                                            ).toFixed(1) + ' %'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    </div>
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
            </main>
        </div>
    );
}
