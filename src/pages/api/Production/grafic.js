import db from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const { user_id } = req.body;
    let connection;

    try {
        // Acquire a connection from the pool
        connection = await db.acquire();

        const [rows] = await connection.query(`
            SELECT 
                DAYOFWEEK(dr.row_date) AS day_of_week, 
                COUNT(*) AS cases_per_day
            FROM 
                daily_reports dr
            WHERE 
                dr.row_date >= CURDATE() - INTERVAL (DAYOFWEEK(CURDATE()) - 2) DAY
                AND dr.row_date < CURDATE() + INTERVAL (8 - DAYOFWEEK(CURDATE())) DAY
                AND dr.user_id = ?
                AND dr.task_id = 1
                AND dr.type_id = 54
            GROUP BY 
                DAYOFWEEK(dr.row_date)
            ORDER BY 
                DAYOFWEEK(dr.row_date)
        `, [user_id]);
        await db.release(connection);
        res.status(200).json({ success: true, reports: rows });
    } catch (error) {
        console.error('Error al obtener los informes:', error);
        await db.release(connection);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
}
