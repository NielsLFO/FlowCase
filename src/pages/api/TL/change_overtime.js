import db from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { tl_name } = req.body;

    let connection;

    try {
        // Acquire a connection from the pool
        connection = await db.acquire();

        // Obtener la fecha de hoy con JavaScript nativo
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // Query para obtener las horas extras activas
        const [overtimeRows] = await connection.query(
            `SELECT o.id, o.user_id, u.user_name, o.type_time, o.overtime_date, o.start_time, o.end_time, o.comments 
                FROM overtime o
                    INNER JOIN users u ON u.id = o.user_id
                        INNER JOIN tl t ON t.id = u.tl_id
                            WHERE t.tl_name = ? and o.overtime_date >= ? `,
            [tl_name, today]
        );
        // Liberar la conexión al pool
        await db.release(connection);

        if (overtimeRows.length > 0) {
            return res.status(200).json({ success: true, data: overtimeRows });
        } else {
            return res.status(404).json({ success: false, message: 'No active overtime found.' });
        }
    } catch (error) {
        console.error('Error fetching active overtime:', error);
        if (connection) await db.release(connection);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}
