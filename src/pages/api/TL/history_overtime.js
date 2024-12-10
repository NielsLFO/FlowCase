import db from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const { tl_name, startDate, endDate } = req.body;
    let connection;

    try {
        // Acquire a connection from the pool using `generic-pool`
        connection = await db.acquire();

        const [rows] = await connection.query(`
            SELECT o.id, o.user_id, u.user_name, o.type_time, o.overtime_date, o.start_time, o.end_time, o.comments 
                FROM overtime o
                    INNER JOIN users u ON u.id = o.user_id
                        INNER JOIN tl t ON t.id = u.tl_id
                            WHERE t.tl_name = ? and o.overtime_date BETWEEN ? AND ?
        `, [tl_name, startDate, endDate]);
        await db.release(connection);
        res.status(200).json({ success: true, reports: rows });
    } catch (error) {
        console.error('Error al obtener los informes:', error);
        await db.release(connection);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
}