import db from '../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { user_id, row_date } = req.body;

    try {
        const [rows] = await db.query(`
            SELECT id, user_id, task_id, type_id, alias, commment, row_status, 
                   DATE_FORMAT(start_time, '%Y-%m-%d %H:%i:%s') as start_time,
                   DATE_FORMAT(end_time, '%Y-%m-%d %H:%i:%s') as end_time,
                   total_time, role_id
            FROM daily_reports 
            WHERE user_id = ? AND row_date = ? 
            ORDER BY start_time ASC
        `, [user_id, row_date]);

        res.status(200).json({ success: true, reports: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}


