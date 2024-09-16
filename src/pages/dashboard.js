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
        task: '',
        type: '',
        alias: '',
        comments: '',
        completed: 'play',
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
        // Obtener la hora actual
        const currentTime = new Date().toLocaleTimeString();
        setDataRows(prev => [...prev, { ...formData, time: currentTime }]);
        setFormData({
            task: '',
            type: '',
            alias: '',
            comments: '',
            completed: 'play',
            time: '',
        });
    };

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
        }
    };

    const handleOptionChange = (option) => {
        setSelectedOption(option);
        setShowPasswordChangeForm(false); // Ocultar formulario de cambio de contraseña al cambiar de opción
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

    const completedCases = dataRows.length;
    const targetCases = 6;

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
                                    <select name="type" value={formData.task} onChange={handleFormChange}>
                                        <option value="">Select</option>
                                        <option value="item1">Production</option>
                                        <option value="item2">Call</option>
                                        <option value="item3">Meeting</option>
                                        <option value="item4">Other task</option>
                                        <option value="item5">Idle time</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Type:</label>
                                    <select name="type" value={formData.type} onChange={handleFormChange}>
                                        <option value="">Select</option>
                                        <option value="item1">New case</option>
                                        <option value="item2">Item 2</option>
                                        <option value="item3">Item 3</option>
                                        <option value="item4">Item 4</option>
                                        <option value="item5">Item 5</option>
                                        <option value="item6">Item 6</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Alias:</label>
                                    <input type="text" name="alias" value={formData.alias} onChange={handleFormChange} />
                                </div>
                                <div>
                                    <label>Comments:</label>
                                    <textarea name="comments" value={formData.comments} onChange={handleFormChange} />
                                </div>
                                <div>
                                    <label>Completed:</label>
                                    <select name="completed" value={formData.completed} onChange={handleFormChange}>
                                        <option value="play">Start</option>
                                        <option value="stop">Stop</option>
                                        <option value="finish">Finish</option>
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
                {selectedOption === 'History' && !showPasswordChangeForm && (
                    <h1>History</h1>
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
                                    <th>Completed</th>
                                    <th>Time</th> {/* Nueva columna para la hora */}
                                </tr>
                            </thead>
                            <tbody>
                                {dataRows.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.task}</td>
                                        <td>{row.type}</td>
                                        <td>{row.alias}</td>
                                        <td>{row.comments}</td>
                                        <td>{row.completed}</td>
                                        <td>{row.time}</td> {/* Mostrar la hora */}
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
