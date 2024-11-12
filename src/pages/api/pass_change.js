import db from '../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const { userName, oldPassword, newPassword } = req.body;

    if (!userName || !oldPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Faltan datos necesarios.' });
    }

    let connection;

    try {
        // Adquiere una conexión del pool
        connection = await db.acquire();

        // Verificar la contraseña actual
        const [user] = await connection.query(
            'SELECT password FROM users WHERE user_name = ?',
            [userName]
        );

        if (!user || user.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
        }

        // Verifica si la contraseña actual coincide
        const passwordMatch = await bcrypt.compare(oldPassword, user[0].password);
        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'La contraseña actual es incorrecta.' });
        }

        // Hash de la nueva contraseña
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar la contraseña en la base de datos
        await connection.query(
            'UPDATE users SET password = ? WHERE user_name = ?',
            [hashedNewPassword, userName]
        );

        await db.release(connection);
        return res.status(200).json({ success: true, message: 'Contraseña actualizada exitosamente' });

    } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        if (connection) await db.release(connection);
        return res.status(500).json({ success: false, message: 'Error al actualizar la contraseña' });
    }
}
