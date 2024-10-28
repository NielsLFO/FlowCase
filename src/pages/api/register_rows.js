import db from '../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    
    const {
        user_id,
        row_date,
        task_id,
        type_id,
        alias,
        commment,
        row_status,
        start_time,
        total_time,
        role_id,
    } = req.body;

    try {
        // Inserta el nuevo registro en la tabla
        const [result] = await db.query(`
            INSERT INTO daily_reports (user_id, row_date, task_id, type_id, alias, commment, row_status, start_time, total_time, role_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [user_id, row_date, task_id, type_id, alias, commment, row_status, start_time, total_time, role_id]);

        // Devuelve el ID del registro insertado
        res.status(201).json({ success: true, insertId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

