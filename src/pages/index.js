import { useState, useContext } from "react";
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from "../styles/index.module.css"; 
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

export default function Home() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const [alertConfig, setAlertConfig] = useState({
        open: false,
        severity: 'error', // 'success', 'info', 'warning', o 'error'
        title: 'Error',
        message: '',
    });
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
    
            const data = await res.json();
    
            if (data.success) {
                sessionStorage.setItem('userEmail', data.email);
                sessionStorage.setItem('roleId', data.role);
                sessionStorage.setItem('user_name', data.user_name);
                sessionStorage.setItem('schedule_id', data.schedule_id); 
                sessionStorage.setItem('user_id', data.user_id);
                if (data.role === 'admin') {
                    router.push('/dashboard');
                } else if (data.role === 10) {
                    router.push('/dashboard_team_lead');
                } else if (data.role !== 10){
                    router.push('/dashboard');
                }
            } else {
                showAlert('error', 'Login Error', data.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            showAlert('error', 'Login Error', 'There was a problem with the server.');
        }
    };
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
        <main className={styles.main}>
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
            <div className={styles.leftColumn}>
                <div className={styles.title}>
                    <p>Welcome to LightForce<br /><code className={styles.code}></code></p>
                </div>
                <div className={styles.titlename}>
                    <p>FlowCase<br /><code className={styles.code}></code></p>
                </div>
                <div className={styles.subtitle}>
                    <p>Please log in using your LightForce email to access FlowCase.</p>
                </div>
                <form className={styles.loginForm} onSubmit={handleSubmit}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="text" // Cambié el tipo a "text" para coincidir con los nombres de usuario como Niels o Daniel
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Log In</button>
                    {error && <p className={styles.error}>{error}</p>} {/* Muestra el mensaje de error */}
                </form>
                <div className={styles.logoLFContainer}>
                    <Image
                        className={styles.logoLF}
                        src="/logoLF.png"
                        alt="Logo LF"
                        width={200}
                        height={200}
                        priority
                    />             
                </div>
                <div className={styles.sublowertitle}>
                    <p>Sponsored by LightForce</p>
                </div>
            </div>
        </main>
    );
}
