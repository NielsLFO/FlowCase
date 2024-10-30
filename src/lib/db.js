// db.js
import mysql from 'mysql2/promise';
import { createPool } from 'generic-pool';

// Configuración de la conexión a la base de datos
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Niels.Morales9086',
    database: 'flowcase'
};

// Crear el pool de conexiones con `generic-pool`
const pool = createPool({
    create: async () => {
        // Crea una nueva conexión usando `mysql2`
        const connection = await mysql.createConnection(dbConfig);
        
        // Manejo de eventos de error en la conexión
        connection.on('error', (err) => {
            console.error('Error en la conexión a la base de datos:', err);
        });
        
        return connection;
    },
    destroy: async (connection) => {
        // Cierra la conexión al liberarla del pool
        await connection.end();
    }
}, {
    max: 10,                  // Número máximo de conexiones en el pool
    min: 2,                   // Número mínimo de conexiones en el pool
    idleTimeoutMillis: 30000, // Tiempo máximo de inactividad antes de liberar una conexión
    acquireTimeoutMillis: 30000 // Tiempo máximo para obtener una conexión antes de lanzar un error
});

// Manejadores de eventos
pool.on('acquire', (connection) => {
    console.log('Conexión adquirida: ', connection.threadId);
});

pool.on('release', (connection) => {
    console.log('Conexión liberada: ', connection.threadId);
});

export default pool;



