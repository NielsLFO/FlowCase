// api/update_row.js
import db from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const { row_id, data } = req.body;

    let connection;

    try {
        connection = await db.acquire();
        const values = [
            data.end_time, 
            data.totalTime, 
            row_id
        ];

       // First update

        const [result] = await connection.execute(
            `UPDATE daily_reports 
             SET row_status = 'Finish', end_time = ?, total_time = ?
             WHERE id = ?`,
            values
        );

        await db.release(connection);

        if (result.affectedRows > 0) {
            res.status(200).json({ success: true });
        } else {
            res.status(400).json({ success: false, message: 'Una o más actualizaciones fallaron.' });
        }
    } catch (error) {
        console.error('Error al actualizar el registro:', error);
        if (connection) await db.release(connection);
        res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }
}
