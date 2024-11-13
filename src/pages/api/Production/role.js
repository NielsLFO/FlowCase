import db from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const { email } = req.body;
    let connection;

    try {
        // Acquire a connection from the pool
        connection = await db.acquire();

        // Query the user's role
        const [roleRows] = await connection.query('SELECT role_id FROM users WHERE email = ?', [email]);
        
        if (roleRows.length > 0) {
            const role = roleRows[0].role_id;

            // Query the tasks associated with the role
            const [taskRows] = await connection.query(`
                SELECT id, task_name 
                FROM tasks 
                WHERE FIND_IN_SET(?, REPLACE(REPLACE(id_roles, '[', ''), ']', '')) > 0
            `, [role]);

            const tasks = taskRows.map(row => ({
                id: row.id,
                task_name: row.task_name
            }));

            let types = [];
            if (tasks.length > 0) {
               // Query the option types for the first task
                const [typeRows] = await connection.query(`
                    SELECT id, type_value, task_id 
                    FROM type_options 
                    WHERE task_id = ? AND FIND_IN_SET(?, REPLACE(REPLACE(role_id, '[', ''), ']', '')) > 0
                `, [tasks[0].id, role]);

                types = typeRows.map(row => ({
                    id: row.id,
                    type_value: row.type_value
                }));
            }

            await db.release(connection);
            return res.status(200).json({ success: true, role, tasks, types });
        } else {
            await db.release(connection);
            return res.status(404).json({ success: false, message: 'Rol no encontrado' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        if (connection) await db.release(connection);
        return res.status(500).json({ success: false, message: 'Error en el servidor' });
    } 
}
