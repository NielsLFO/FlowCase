import db from '../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, password } = req.body;

    try {
        const [rows] = await db.query('SELECT id, user_name, email, role_id, schedule_id FROM users WHERE email = ? AND user_password = ?', [email, password]);
        if (rows.length > 0) {
            res.status(200).json({ success: true, user_id: rows[0].id, user_name: rows[0].user_name, email: rows[0].email, role: rows[0].role_id, schedule_id: rows[0].schedule_id });
        } else {
            res.status(401).json({ success: false, message: 'Incorrect username or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}
