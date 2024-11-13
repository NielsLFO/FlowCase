import db from '../../../lib/db';

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

    let connection;
    try {
        // Acquire a connection from the pool
        connection = await db.acquire();
        const [result] = await connection.query(`
            INSERT INTO daily_reports (user_id, row_date, task_id, type_id, alias, commment, row_status, start_time, total_time, role_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [user_id, row_date, task_id, type_id, alias, commment, row_status, start_time, total_time, role_id]);
        await db.release(connection);
        res.status(201).json({ success: true, insertId: result.insertId });
    } catch (error) {
        console.error('Error al insertar el registro:', error);
        await db.release(connection);
        res.status(500).json({ success: false, message: 'Server error' });
    } 
}

