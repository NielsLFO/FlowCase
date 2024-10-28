import mysql from 'mysql2/promise';

const db = mysql.createPool({
    host: 'localhost',     
    user: 'root',   
    password: 'Niels.Morales9086', 
    database: 'flowcase', 
    waitForConnections: true,
    connectionLimit: 10,  // Número máximo de conexiones en el pool
    queueLimit: 0
});

export default db;


