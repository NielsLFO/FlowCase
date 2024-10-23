import db from '../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email } = req.body;

    try {
        const [rows] = await db.query('SELECT role_id FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            res.status(200).json({ success: true, role: rows[0].role_id });
        } else {
            res.status(401).json({ success: false, message: 'Role not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}
