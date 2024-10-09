import React, { useState, useEffect } from 'react'; // Asegúrate de incluir useEffect aquí
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { FaCog } from 'react-icons/fa'; // Importa el ícono de engranaje
import styles from '../styles/dashboard_TL.module.css';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';


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

        // Datos para el gráfico de tipo de casos completados
        const groupData = {
            labels: ['New Cases', 'Reworks', 'Team Lead Consult'],
            datasets: [
                {
                    label: '',
                    data: [2, 4, 3],
                    backgroundColor: [
                        'rgba(66, 135, 245, 0.6)',  // Color nuevo para 'New Cases'
                        'rgba(255, 166, 0, 0.6)',   // Color nuevo para 'Reworks'
                        'rgba(231, 76, 60, 0.6)',   // Color nuevo para 'Team Lead Consult'
                    ],
                    borderColor: [
                        'rgba(66, 135, 245, 1)',
                        'rgba(255, 166, 0, 1)',
                        'rgba(231, 76, 60, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        };

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

        // Datos para el gráfico de producción semanal
        const weeklyData = {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            datasets: [
                {
                    label: 'Tech #1',
                    data: [1, 2, 3, 2, 1],
                    backgroundColor: techColors[0],
                    borderColor: techColors[0].replace('0.6', '1'),
                    borderWidth: 1,
                },
                {
                    label: 'Tech #2',
                    data: [2, 3, 1, 4, 2],
                    backgroundColor: techColors[1],
                    borderColor: techColors[1].replace('0.6', '1'),
                    borderWidth: 1,
                },
                {
                    label: 'Tech #3',
                    data: [3, 2, 4, 3, 5],
                    backgroundColor: techColors[2],
                    borderColor: techColors[2].replace('0.6', '1'),
                    borderWidth: 1,
                },
                {
                    label: 'Tech #4',
                    data: [1, 4, 2, 1, 3],
                    backgroundColor: techColors[3],
                    borderColor: techColors[3].replace('0.6', '1'),
                    borderWidth: 1,
                },
                {
                    label: 'Tech #5',
                    data: [2, 1, 3, 5, 2],
                    backgroundColor: techColors[4],
                    borderColor: techColors[4].replace('0.6', '1'),
                    borderWidth: 1,
                },
                {
                    label: 'Tech #6',
                    data: [4, 3, 2, 1, 4],
                    backgroundColor: techColors[5],
                    borderColor: techColors[5].replace('0.6', '1'),
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
                    display: false,
                    text: 'Weekly Production Report',
                },
            },
        };

        // Datos para el gráfico de producción individual
        const individualData = {
            labels: ['Tech #1', 'Tech #2', 'Tech #3', 'Tech #4', 'Tech #5', 'Tech #6'],
            datasets: [
                {
                    label: 'Cases per Technician',
                    data: [2, 4, 3, 4, 6, 4],
                    backgroundColor: techColors,
                    borderColor: techColors.map(color => color.replace('0.6', '1')),
                    borderWidth: 1,
                },
            ],
        };

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

    //#endregion

    //#region Code for Manage Times section

    /*********************************************************************************************/
    /***                  All The Validations needed for Manage Times section                  ***/
    /*********************************************************************************************/

        const [searchData, setSearchData] = useState({
            startDate: '',
            endDate: '',
            technician: '',
        });

        const [tableData, setTableData] = useState([]);

        const handleSearchFormChange = (e) => {
            const { name, value } = e.target;
            setSearchData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        };

        const handleSearchSubmit = (e) => {
            e.preventDefault();

            // Crear un nuevo objeto con los datos del formulario
            const newEntry = {
                technician: searchData.technician,
                task: 'Task Example', // Aquí puedes cambiar a un valor real
                type: 'Type Example', // Aquí puedes cambiar a un valor real
                alias: 'Alias Example', // Aquí puedes cambiar a un valor real
                comments: 'Comments Example', // Aquí puedes cambiar a un valor real
                status: 'In Progress', // Aquí puedes cambiar a un valor real
                startTime: '09:00 AM', // Aquí puedes cambiar a un valor real
                endTime: '10:00 AM', // Aquí puedes cambiar a un valor real
                totalTime: '1 hour', // Aquí puedes cambiar a un valor real
                role: 'Role Example', // Aquí puedes cambiar a un valor real
            };

            // Actualiza el estado de la tabla con la nueva entrada
            setTableData((prevData) => [...prevData, newEntry]);

            // Reiniciar el formulario
            setSearchData({
                startDate: '',
                endDate: '',
                technician: '',
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
                        <button className={`${styles.signOutButton} ${showPasswordChangeForm ? styles.activeButton : ''}`} onClick={() => console.log('User signed out')}>
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
                {selectedOption === 'Today Team Work' && !showPasswordChangeForm && (
                    <div className={styles.mainContent}>
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
                                <h2>Weekly Production Report</h2>
                                <Bar data={weeklyData} options={weeklyChartOptions} />
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
                                <tr>
                                    <td>Tech #1</td>
                                    <td>Install Brackets</td>
                                    <td>New Case</td>
                                    <td>Patient_A1</td>
                                    <td>N/A</td>
                                    <td>Completed</td>
                                    <td>08:00</td>
                                    <td>09:30</td>
                                    <td>1h 30m</td>
                                    <td>Technician</td>
                                </tr>
                                <tr>
                                    <td>Tech #2</td>
                                    <td>Adjustment</td>
                                    <td>Rework</td>
                                    <td>Patient_B2</td>
                                    <td>Replaced bands</td>
                                    <td>In Progress</td>
                                    <td>10:00</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>Technician</td>
                                </tr>
                                <tr>
                                    <td>Tech #3</td>
                                    <td>Initial Consultation</td>
                                    <td>Team Lead Consult</td>
                                    <td>Patient_C3</td>
                                    <td>Discussed treatment options</td>
                                    <td>Completed</td>
                                    <td>11:00</td>
                                    <td>11:45</td>
                                    <td>45m</td>
                                    <td>Team Lead</td>
                                </tr>
                                <tr>
                                    <td>Tech #4</td>
                                    <td>Retainer Check</td>
                                    <td>Rework</td>
                                    <td>Patient_D4</td>
                                    <td>Adjusted fit</td>
                                    <td>Pending</td>
                                    <td>12:00</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>Technician</td>
                                </tr>
                                <tr>
                                    <td>Tech #5</td>
                                    <td>Bracket Removal</td>
                                    <td>New Case</td>
                                    <td>Patient_E5</td>
                                    <td>Final phase</td>
                                    <td>Completed</td>
                                    <td>13:30</td>
                                    <td>14:15</td>
                                    <td>45m</td>
                                    <td>Technician</td>
                                </tr>
                                <tr>
                                    <td>Tech #6</td>
                                    <td>Follow-up</td>
                                    <td>Rework</td>
                                    <td>Patient_F6</td>
                                    <td>Minor adjustments needed</td>
                                    <td>In Progress</td>
                                    <td>15:00</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>Technician</td>
                                </tr>
                                <tr>
                                    <td>Tech #1</td>
                                    <td>Install Brackets</td>
                                    <td>New Case</td>
                                    <td>Patient_A1</td>
                                    <td>N/A</td>
                                    <td>Completed</td>
                                    <td>08:00</td>
                                    <td>09:30</td>
                                    <td>1h 30m</td>
                                    <td>Technician</td>
                                </tr>
                                <tr>
                                    <td>Tech #2</td>
                                    <td>Adjustment</td>
                                    <td>Rework</td>
                                    <td>Patient_B2</td>
                                    <td>Replaced bands</td>
                                    <td>In Progress</td>
                                    <td>10:00</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>Technician</td>
                                </tr>
                                <tr>
                                    <td>Tech #3</td>
                                    <td>Initial Consultation</td>
                                    <td>Team Lead Consult</td>
                                    <td>Patient_C3</td>
                                    <td>Discussed treatment options</td>
                                    <td>Completed</td>
                                    <td>11:00</td>
                                    <td>11:45</td>
                                    <td>45m</td>
                                    <td>Team Lead</td>
                                </tr>
                                <tr>
                                    <td>Tech #4</td>
                                    <td>Retainer Check</td>
                                    <td>Rework</td>
                                    <td>Patient_D4</td>
                                    <td>Adjusted fit</td>
                                    <td>Pending</td>
                                    <td>12:00</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>Technician</td>
                                </tr>
                                <tr>
                                    <td>Tech #5</td>
                                    <td>Bracket Removal</td>
                                    <td>New Case</td>
                                    <td>Patient_E5</td>
                                    <td>Final phase</td>
                                    <td>Completed</td>
                                    <td>13:30</td>
                                    <td>14:15</td>
                                    <td>45m</td>
                                    <td>Technician</td>
                                </tr>
                                <tr>
                                    <td>Tech #6</td>
                                    <td>Follow-up</td>
                                    <td>Rework</td>
                                    <td>Patient_F6</td>
                                    <td>Minor adjustments needed</td>
                                    <td>In Progress</td>
                                    <td>15:00</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>Technician</td>
                                </tr>
                                <tr>
                                    <td>Tech #1</td>
                                    <td>Install Brackets</td>
                                    <td>New Case</td>
                                    <td>Patient_A1</td>
                                    <td>N/A</td>
                                    <td>Completed</td>
                                    <td>08:00</td>
                                    <td>09:30</td>
                                    <td>1h 30m</td>
                                    <td>Technician</td>
                                </tr>
                                <tr>
                                    <td>Tech #2</td>
                                    <td>Adjustment</td>
                                    <td>Rework</td>
                                    <td>Patient_B2</td>
                                    <td>Replaced bands</td>
                                    <td>In Progress</td>
                                    <td>10:00</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>Technician</td>
                                </tr>
                                <tr>
                                    <td>Tech #3</td>
                                    <td>Initial Consultation</td>
                                    <td>Team Lead Consult</td>
                                    <td>Patient_C3</td>
                                    <td>Discussed treatment options</td>
                                    <td>Completed</td>
                                    <td>11:00</td>
                                    <td>11:45</td>
                                    <td>45m</td>
                                    <td>Team Lead</td>
                                </tr>
                                <tr>
                                    <td>Tech #4</td>
                                    <td>Retainer Check</td>
                                    <td>Rework</td>
                                    <td>Patient_D4</td>
                                    <td>Adjusted fit</td>
                                    <td>Pending</td>
                                    <td>12:00</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>Technician</td>
                                </tr>
                                <tr>
                                    <td>Tech #5</td>
                                    <td>Bracket Removal</td>
                                    <td>New Case</td>
                                    <td>Patient_E5</td>
                                    <td>Final phase</td>
                                    <td>Completed</td>
                                    <td>13:30</td>
                                    <td>14:15</td>
                                    <td>45m</td>
                                    <td>Technician</td>
                                </tr>
                                <tr>
                                    <td>Tech #6</td>
                                    <td>Follow-up</td>
                                    <td>Rework</td>
                                    <td>Patient_F6</td>
                                    <td>Minor adjustments needed</td>
                                    <td>In Progress</td>
                                    <td>15:00</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>Technician</td>
                                </tr>
                            </tbody>

                        </table>
                    </div>
                )}
                {selectedOption === 'Manage Times' && !showPasswordChangeForm && (
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

                    {/* Dropdown List para Técnicos */}
                    <div>
                        <label htmlFor="technician" className={styles.searchLabel}>Select Technician:</label>
                        <select
                            id="technician"
                            name="technician"
                            value={searchData.technician}
                            onChange={handleSearchFormChange}
                            className={styles.searchInput} // Aplica el estilo del input
                        >
                            <option value="" disabled>Select a Technician</option>
                            <option value="technician1">Technician #1</option>
                            <option value="technician2">Technician #2</option>
                            <option value="technician3">Technician #3</option>
                            <option value="technician4">Technician #4</option>
                            <option value="technician5">Technician #5</option>
                            <option value="technician6">Technician #6</option>
                        </select>
                    </div>

                    <button type="submit" className={styles.searchButton}>Search</button>
                </form>
            )}
            {/* Tabla con los campos especificados */}
            {selectedOption === 'Manage Times' && !showPasswordChangeForm && (
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
                    {tableData.map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.technician}</td>
                            <td>{entry.task}</td>
                            <td>{entry.type}</td>
                            <td>{entry.alias}</td>
                            <td>{entry.comments}</td>
                            <td>{entry.status}</td>
                            <td>{entry.startTime}</td>
                            <td>{entry.endTime}</td>
                            <td>{entry.totalTime}</td>
                            <td>{entry.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
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
