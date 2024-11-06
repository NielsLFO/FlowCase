import db from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const { tl_user_name } = req.body;
    let connection;

    try {
        // Adquiere una conexión del pool usando `generic-pool`
        connection = await db.acquire();

        // Realiza la consulta para obtener los tipos según `task_id` y `role_id`
        const [data] = await connection.query(`
            SELECT u.id, u.user_name from users u
            INNER JOIN tl t ON u.tl_id = t.id 
            WHERE t.tl_name = ?
        `, [tl_user_name]);

        const users = data.map(row => ({
            id: row.id,
            user_name: row.user_name
        }));

        // Libera la conexión de vuelta al pool
        await db.release(connection);
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error('Error al realizar la consulta:', error);
        if (connection) await db.release(connection);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    } 
}