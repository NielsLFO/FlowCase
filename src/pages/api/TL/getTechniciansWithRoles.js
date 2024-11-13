import db from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const { tl_name } = req.body;
    let connection;

    try {
         // Acquire a connection from the pool using `generic-pool`
        connection = await db.acquire();
        // Query the tasks associated with the role
        const [technitian_role] = await connection.query(`
            SELECT u.id, u.user_name, u.role_id
                FROM users u
                    INNER JOIN roles r ON u.role_id = r.id
                        INNER JOIN tl t ON t.id = u.tl_id
                            WHERE t.tl_name = ? and u.user_name <> ?
                                ORDER BY u.user_name ASC
            `, [tl_name, tl_name]);
        await db.release(connection);
        return res.status(200).json({ success: true, data: technitian_role });
    } catch (error) {
        console.error('Error en la consulta:', error);
        if (connection) await db.release(connection);
        return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
}
