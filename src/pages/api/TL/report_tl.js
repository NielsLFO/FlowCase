import db from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const { tl_name, currentDate } = req.body;
    let connection;

    try {
        // Acquire a connection from the pool using `generic-pool`
        connection = await db.acquire();

        const [rows] = await connection.query(`
            SELECT dr.id, dr.user_id, u.user_name, dr.row_date, dr.task_id, t.task_name, dr.type_id, tp.type_value, dr.alias, dr.commment, dr.row_status, 
            DATE_FORMAT(dr.start_time, '%Y-%m-%d %H:%i:%s') as start_time, DATE_FORMAT(dr.end_time, '%Y-%m-%d %H:%i:%s') as end_time,
            dr.total_time, dr.role_id, r.role_name, u.tl_id, l.tl_name, dr.type_case
            FROM daily_reports dr
            INNER JOIN tasks t ON dr.task_id = t.id
            INNER JOIN type_options tp ON dr.type_id = tp.id
            INNER JOIN roles r ON dr.role_id = r.id
            INNER JOIN users u ON dr.user_id = u.id
            INNER JOIN tl l ON u.tl_id = l.id 
            WHERE l.tl_name = ?
            AND dr.row_date = ?
            ORDER BY dr.start_time ASC;
        `, [tl_name, currentDate]);
        await db.release(connection);
        res.status(200).json({ success: true, reports: rows });
    } catch (error) {
        console.error('Error al obtener los informes:', error);
        await db.release(connection);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
}

