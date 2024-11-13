import db from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    let connection;

    try {
         // Acquire a connection from the pool using `generic-pool`
        connection = await db.acquire();
            // Query the tasks associated with the role
            const [taskRows] = await connection.query(`
                SELECT id, task_name 
                FROM tasks 
            `);

            const tasks = taskRows.map(row => ({
                id: row.id,
                task_name: row.task_name
            }));
            await db.release(connection);
            return res.status(200).json({ success: true, tasks });

    } catch (error) {
        console.error('Error en la consulta:', error);
        if (connection) await db.release(connection);
        return res.status(500).json({ success: false, message: 'Error en el servidor' });
    } 
}