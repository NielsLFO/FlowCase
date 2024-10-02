import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { FaCog } from 'react-icons/fa'; // Importa el ícono de engranaje
import styles from '../styles/dashboard.module.css';

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
    const [selectedOption, setSelectedOption] = useState('Today Work');
    const [formData, setFormData] = useState({
        task: 'Production',
        type: 'New case',
        alias: '',
        comments: '',
        status: 'Started',
    });
    const [dataRows, setDataRows] = useState([]);
    const [showPasswordChangeForm, setShowPasswordChangeForm] = useState(false);
    const [passwordChangeData, setPasswordChangeData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChangeChange = (e) => {
        const { name, value } = e.target;
        setPasswordChangeData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
    
        // Validar que se hayan seleccionado Task y Type
        if (!formData.task || !formData.type) {
            alert('Please select both Task and Type.');
            return;
        }
    
        // Validar que si Type es 'Other', el campo de comentarios no esté vacío
        if (formData.type === 'Other' && !formData.comments) {
            alert('Please fill in the comments when selecting "Other".');
            return;
        }
        
        // Obtener la hora actual
        const currentTime = getCurrentDateTime();;

        // Verificar si hay filas de datos
        if (dataRows.length > 0) {
            const lastRowIndex = dataRows.length - 1; // Índice de la última fila
            const lastRow = dataRows[lastRowIndex]; // Última fila

            // Verificar el estado de la última fila
            if (lastRow.status === 'Started') {
                if (lastRow.alias !== formData.alias) {
                    alert('You must complete the previous task before adding a new one.');
                    return;
                } else if (lastRow.task === formData.task && lastRow.type === formData.type && lastRow.alias === formData.alias && (formData.status === 'Stop' || formData.status === 'Finished')) {
                    // Mantener el start time original
                    const startTime = new Date(lastRow.start_time); // start_time debe tener fecha y hora en formato "YYYY-MM-DD HH:MM:SS"
                    const endTime = new Date(); // Obtener la hora actual como Date
                    const timeDifference = endTime - startTime; // Diferencia en milisegundos
                    const elapsedMinutes = Math.floor(timeDifference / 60000); // Convertir a minutos
                    // Actualizar la fila con el nuevo status y end time
                    const updatedRow = {
                        ...lastRow,
                        comments: formData.comments,
                        status: formData.status,
                        end_time: currentTime, // Registrar la nueva hora de finalización
                        total_time: `${elapsedMinutes} min`, // Calcular el tiempo transcurrido
                    };

                    // Actualizar el estado de las filas de datos
                    const updatedDataRows = [...dataRows];
                    updatedDataRows[lastRowIndex] = updatedRow; // Usar el índice para actualizar la fila
                    setDataRows(updatedDataRows);
                    // Limpiar el formulario después de agregar el registro
                    setFormData({
                        task: '',
                        type: '',
                        alias: '',
                        comments: '',
                        status: 'Started',
                    });
                }
            }else{
                // Agregar nueva fila
                setDataRows(prev => [...prev, { ...formData, start_time: currentTime, end_time: "00:00:00", total_time: "00:00:00" }]);
            }
        }else{
            // Agregar nueva fila
            setDataRows(prev => [...prev, { ...formData, start_time: currentTime, end_time: "00:00:00", total_time: "00:00:00" }]);
        };
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

    // Función para obtener las opciones dinámicas de estado
    const getStatusOptions = () => {
        if (dataRows.length > 0) {
            const lastStatus = dataRows[dataRows.length - 1].status;
            if (lastStatus === 'Started') {
                return ['Finished', 'Stop'];
            } else if (lastStatus === 'Stop' || lastStatus === 'Finished') {
                return ['Started'];
            }
        }
        return ['Started'];
    };
    
    const availableStatusOptions = getStatusOptions();
    

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
            alert('New passwords do not match.');
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

    const targetCases = 6;

    const completedCases = dataRows.filter(row => 
        row.task === 'Production' && 
        row.type === 'New case' && 
        row.alias.trim() !== '' &&
        row.status === "Finished"
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
            x: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
                grid: {
                    display: true,
                    drawBorder: true,
                    color: '#e0e0e0', // Color para las líneas de la cuadrícula
                },
                afterDataLimits: function(scale) {
                    scale.max = Math.max(targetCases, completedCases); // Ajustar el máximo basado en los datos y el objetivo
                }
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

    // Definir las opciones dinámicas para el campo "Type"
    const typeOptions = {
        Production: [
            { value: 'New case', label: 'New case' },
            { value: 'Clinical rework', label: 'Clinical rework' },
            { value: 'QA rework', label: 'QA rework' },
            { value: 'Doctor rework', label: 'Doctor rework' },
            { value: 'QA review', label: 'QA review' },
            { value: 'Doctor rework review', label: 'Doctor rework review' },
            { value: 'Final MFG review', label: 'Final MFG review' },
        ],
        Call: [
            { value: 'Support from TL', label: 'Support from TL' },
            { value: 'Support from clinical', label: 'Support from clinical' },
            { value: 'Support from QA', label: 'Support from QA' },
            { value: 'Feedback from TL', label: 'Feedback from TL' },
            { value: 'Feedback from clinical', label: 'Feedback from clinical' },
            { value: 'Feedback from QA', label: 'Feedback from QA' },
        ],
        Meeting: [
            { value: 'OTP team huddle', label: 'OTP team huddle' },
            { value: 'Training', label: 'Training' },
            { value: '1:1', label: '1:1' },
            { value: 'Monthly all hands', label: 'Monthly all hands' },
            { value: 'How its made', label: 'How its made' },
            { value: 'Coffee talk', label: 'Coffee talk' },
            { value: 'CR town hall', label: 'CR town hall' },
            { value: 'UKR global stand-up', label: 'UKR global stand-up' },
            { value: 'UKR team', label: 'UKR team' },
            { value: 'Other', label: 'Other' },
        ],
        Other_Task: [
            { value: 'Projects', label: 'Projects' },
            { value: 'Backup', label: 'Backup' },
            { value: 'Certification', label: 'Certification' },
            { value: 'Mentoring', label: 'Mentoring' },
            { value: 'Other', label: 'Other' },
        ],
        Idle_Time: [
            { value: 'Waiting for case', label: 'Waiting for case' },
            { value: 'Waiting for support', label: 'Waiting for support' },
            { value: 'Electricity problem', label: 'Electricity problem' },
            { value: 'Internet problem', label: 'Internet problem' },
            { value: 'Lunch', label: 'Lunch' },
            { value: 'Break', label: 'Break' },
            { value: 'Reposition', label: 'Reposition' },
            { value: 'Personal needs', label: 'Personal needs' },
            { value: 'Other', label: 'Other' },
        ],
    };

    // Obtener las opciones de "Type" basadas en la tarea seleccionada
    const availableTypeOptions = typeOptions[formData.task] || [];

    //Apartir de aqui va el codigo para la opcion de history
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
                {selectedOption === 'Today Work' && !showPasswordChangeForm && (
                    <div className={styles.mainContent}>
                        <div className={styles.formSection}>
                            <form onSubmit={handleFormSubmit}>
                                <div>
                                    <h2>Case Flow</h2>
                                    <label>Task:</label>
                                    <select name="task" value={formData.task} onChange={handleFormChange}>
                                        <option value="">Select Task</option>
                                        <option value="Production">Production</option>
                                        <option value="Call">Call</option>
                                        <option value="Meeting">Meeting</option>
                                        <option value="Other_Task">Other task</option>
                                        <option value="Idle_Time">Idle time</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Type:</label>
                                    <select name="type" value={formData.type} onChange={handleFormChange} disabled={!formData.task}>
                                        <option value="">Select Type</option>
                                        {availableTypeOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    {/* Mostrar alias solo si task es "Production" */}
                                    {formData.task === 'Production' && (
                                        <>
                                            <label htmlFor="alias" className={styles.label}>Alias:</label>
                                            <input type="text" name="alias" id="alias" value={formData.alias} onChange={handleFormChange} className={styles.input} />
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
                                <button type="submit">Add Register</button>
                            </form>
                        </div>
                        <div className={styles.chartSection}>
                            <h2>Production Report</h2>
                            <p>Total cases: {completedCases} / {targetCases}</p>
                            <Bar data={chartData} options={chartOptions} />
                        </div>

                        {/* Timer Section */}
                        <div className={styles.timerSection}>
                            <h2>Timer</h2>
                            {/* Contenido del temporizador */}
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
                            <button type="submit">Change Password</button>
                            <button type="button" onClick={() => setShowPasswordChangeForm(false)} className={styles.cancelButton}>Cancel</button>
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
                                </tr>
                            </thead>
                            <tbody>
                                {dataRows.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.task}</td>
                                        <td>{row.type}</td>
                                        <td>{row.alias}</td>
                                        <td>{row.comments}</td>
                                        <td>{row.status}</td>
                                        <td>{row.start_time}</td> 
                                        <td>{row.end_time}</td> 
                                        <td>{row.total_time}</td> 
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
