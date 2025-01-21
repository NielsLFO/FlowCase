import db from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const { user_id, startDate, endDate } = req.body;
    let connection;

    try {
        // Acquire a connection from the pool using `generic-pool`
        connection = await db.acquire();
        const [rows] = await connection.query(`
            SELECT dr.user_id, u.user_name, SUM(dr.total_time) AS total_time
            FROM daily_reports dr
            INNER JOIN tasks t ON dr.task_id = t.id
            INNER JOIN users u ON dr.user_id = u.id
            INNER JOIN tl tt ON u.tl_id = tt.id
            WHERE tt.id = ? 
                AND t.id = 5
                AND dr.row_date BETWEEN ? AND ?
            GROUP BY dr.user_id, u.user_name
            ORDER BY total_time DESC;
        `, [user_id, startDate, endDate]);
        const [rows2] = await connection.query(`
            SELECT tp.type_value, SUM(dr.total_time) AS total_time
            FROM daily_reports dr
            INNER JOIN tasks t ON dr.task_id = t.id
            INNER JOIN users u ON dr.user_id = u.id
            INNER JOIN tl tt ON u.tl_id = tt.id
            INNER JOIN type_options tp ON dr.type_id = tp.id
            WHERE tt.id = ?
                AND t.id = 5
                AND dr.row_date BETWEEN ? AND ?
            GROUP BY tp.type_value
            ORDER BY total_time DESC;
        `, [user_id, startDate, endDate]);
        await db.release(connection);
        res.status(200).json({ success: true, reports: rows, types: rows2 });
    } catch (error) {
        console.error('Error al obtener los informes:', error);
        await db.release(connection);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
} 