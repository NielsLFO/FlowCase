// db.js (Archivo de conexión a la base de datos)
import mysql from 'mysql2/promise';

const db = mysql.createPool({
    host: 'localhost',              
    user: 'root',                   
    password: 'Niels.Morales9086',   
    database: 'flowcase',            
    waitForConnections: true,
    connectionLimit: 10,            
    queueLimit: 0,
});

// Manejo de eventos de error
db.on('error', (err) => {
    console.error('Error en el pool de conexiones:', err);
});

export default db;



