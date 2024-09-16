import Head from 'next/head';
import styles from '../styles/login.module.css';
import { useState } from "react";
import Swal from 'sweetalert2';
import Router from 'next/router';

export default function SignUp() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Passwords do not match!',
            });
            return;
        }

        try {
            const response = await fetch('/api/users/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('User created successfully:', data);

            Swal.fire({
                title: 'Success!',
                text: 'User created successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    Router.push('/');
                }
            });
        } catch (error) {
            console.error('Failed to create user:', error);
            Swal.fire({
                icon: 'error',
                title: 'Failed to create user',
                text: error.message || 'Failed to create user',
            });
        }
    };

    const isFormValid = password === confirmPassword && username && password;

    return (
        <div className={styles.loginContainer}>
            <Head>
                <title>Sign up</title>
            </Head>
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
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={!isFormValid}>Confirm</button>
                <div className={styles.btnContainer}>
                <a href="/" className={styles.goBackBtn}>Go back</a>
                </div>
            </form>
        </div>
    );
}