// pages/_app.js
import { UserProvider } from '../../context/UserContext'; // Asegúrate de que la ruta sea correcta

function MyApp({ Component, pageProps }) {
    return (
        <UserProvider>
            <Component {...pageProps} />
        </UserProvider>
    );
}

export default MyApp;
