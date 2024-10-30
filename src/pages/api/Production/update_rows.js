// api/update_row.js
import db from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const { rowId, ...updatedData } = req.body;
    let connection;

    try {
        // Obtiene una conexión del pool con `generic-pool`
        connection = await db.acquire();

        const [result] = await connection.execute(
            'UPDATE daily_reports SET commment = ?, row_status = ?, end_time = ?, total_time = ?, role_id = ? WHERE id = ?',
            [updatedData.comments, updatedData.status, updatedData.end_time, updatedData.total_time, updatedData.role, rowId]
        );

        if (result.affectedRows > 0) {
            await db.release(connection);
            res.status(200).json({ success: true });
        } else {
            await db.release(connection);
            res.status(404).json({ success: false, message: 'Registro no encontrado.' });
        }
    } catch (error) {
        console.error('Error al actualizar el registro:', error);
        if (connection) await db.release(connection);
        res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }
}


