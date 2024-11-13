import db from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const { task_id, role_id } = req.body;
    let connection;

    try {
        // Acquire a connection from the pool using `generic-pool`
        connection = await db.acquire();

        // Perform the query to get the types based on `task_id` and `role_id`

        const [typeRows] = await connection.query(`
            SELECT id, type_value 
            FROM type_options 
            WHERE task_id = ? 
            AND FIND_IN_SET(?, REPLACE(REPLACE(role_id, '[', ''), ']', '')) > 0
        `, [task_id, role_id]);

        const types = typeRows.map(row => ({
            id: row.id,
            type_value: row.type_value
        }));

        await db.release(connection);
        res.status(200).json({ success: true, types });
    } catch (error) {
        console.error('Error al realizar la consulta:', error);
        if (connection) await db.release(connection);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    } 
}
