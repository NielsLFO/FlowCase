import db from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    // Asegúrate de que el cuerpo de la solicitud contiene "roles"
    const { roles } = req.body;
    console.log("Roles recibidos:", roles); // Verificar los datos recibidos

    if (!Array.isArray(roles)) {
        return res.status(400).json({ success: false, message: 'Los roles deben ser un array.' });
    }

    let connection;

    try {
        // Adquiere una conexión del pool
        connection = await db.acquire();

        for (const tecnico of roles) {
            const { name, assignedRoleId } = tecnico; // Un solo role ID por técnico

            // Actualiza el rol en la base de datos
            await connection.query(
                'UPDATE users SET role_id = ? WHERE user_name = ?',
                [assignedRoleId, name]
            );
        }

        await db.release(connection);
        return res.status(200).json({ success: true, message: 'Roles actualizados exitosamente' });

    } catch (error) {
        console.error('Error al actualizar roles:', error);
        if (connection) await db.release(connection);
        return res.status(500).json({ success: false, message: 'Error al actualizar roles' });
    }
}
