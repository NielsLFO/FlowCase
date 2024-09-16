import { useState } from "react";
import Image from 'next/image';
import styles from "../styles/index.module.css"; // Asegúrate de que la ruta sea correcta

export default function Home() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <main className={styles.main}>
            <div className={styles.leftColumn}>
                <div className={styles.title}>
                    <p>Welcome to<br /><code className={styles.code}></code></p>
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
                        type="email"
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
