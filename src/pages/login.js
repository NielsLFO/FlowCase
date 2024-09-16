import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/login.module.css';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('/api/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Invalid username or password');
            }

            const data = await response.json();
            console.log('Login response:', data);
            
            // Almacena el nombre de usuario en sessionStorage
            sessionStorage.setItem('username', username);
            
            // Redirige a la página de catálogo
            router.push('/catalog');
        } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage('Invalid username or password'); // Mensaje de error
        }
    };

    return (
        <div className={styles.loginContainer}>
            <Head>
                <title>Login</title>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
                <link href="https://fonts.googleapis.com/css2?family=Signika+Negative:wght@400;600&display=swap" rel="stylesheet"/>
            </Head>
            <div className={styles.loginImageContainer}>
                <img src="/lapulpe.png" alt="lapulpe" className={styles.loginImage} />
            </div>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                {errorMessage && <p className={styles.errorMsg}>{errorMessage}</p>} {/*Muestra el mensaje de error si existe */}
                <div className={styles.btnContainer}>
                    <a href="/" className={styles.goBackBtn}>Go back</a>
                </div>
            </form>
        </div>
    );
}
