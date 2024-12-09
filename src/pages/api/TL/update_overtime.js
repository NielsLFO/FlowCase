import db from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        const { id, type_time, overtime_date, start_time, end_time, comments } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: 'Missing overtime ID.' });
        }

        let connection;

        try {
            connection = await db.acquire();

            // Query para actualizar la información en la base de datos
            const [updateResult] = await connection.query(
                `UPDATE overtime 
                 SET type_time = ?, overtime_date = ?, start_time = ?, end_time = ?, comments = ?
                 WHERE id = ?`,
                [type_time, overtime_date, start_time, end_time, comments, id]
            );

            await db.release(connection);

            if (updateResult.affectedRows > 0) {
                return res.status(200).json({ success: true, message: 'Overtime updated successfully.' });
            } else {
                return res.status(404).json({ success: false, message: 'Overtime not found.' });
            }
        } catch (error) {
            console.error('Error updating overtime:', error);
            if (connection) await db.release(connection);
            return res.status(500).json({ success: false, message: 'Server error.' });
        }
    } else {
        return res.status(405).json({ message: 'Method not allowed.' });
    }
}
