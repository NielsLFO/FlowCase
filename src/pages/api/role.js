// pages/api/login.js
import db from '../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, password } = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND user_password = ?', [email, password]);
        if (rows.length > 0) {
            // Usuario encontrado
            res.status(200).json({ success: true, role: rows[0].role_id });
        } else {
            // Usuario no encontrado
            res.status(401).json({ success: false, message: 'Incorrect username or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}
