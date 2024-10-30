// api/authenticate.js
import db from '../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const { email, password } = req.body;
    let connection;

    try {
        // Obtiene una conexión del pool con `generic-pool`
        connection = await db.acquire();

        const [rows] = await connection.query(
            'SELECT id, user_name, email, role_id, schedule_id FROM users WHERE email = ? AND user_password = ?', 
            [email, password]
        );

        if (rows.length > 0) {
            await db.release(connection);
            res.status(200).json({
                success: true,
                user_id: rows[0].id,
                user_name: rows[0].user_name,
                email: rows[0].email,
                role: rows[0].role_id,
                schedule_id: rows[0].schedule_id,
            });
        } else {
            await db.release(connection);
            res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        if (connection) await db.release(connection);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
}

