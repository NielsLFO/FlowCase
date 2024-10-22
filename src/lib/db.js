import mysql from 'mysql2/promise';

const db = mysql.createPool({
    host: 'localhost',     
    user: 'root',   
    password: 'Niels.Morales9086', 
    database: 'flowcase', 
});

export default db;