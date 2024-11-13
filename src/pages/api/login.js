import db from '../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, password } = req.body;
    let connection;

    try {
        // Get a connection from the pool with `generic-pool`
        connection = await db.acquire();

        // Query only the necessary fields and the encrypted password
        const [rows] = await connection.query(
            'SELECT id, user_name, email, role_id, schedule_id, user_password FROM users WHERE email = ?', 
            [email]
        );

        // Check if the user exists
        if (rows.length === 0) {
            await db.release(connection);
            return res.status(401).json({ success: false, message: 'Incorrect username or password' });
        }

        const user = rows[0];

        // Compare the entered password with the encrypted one
        const passwordMatch = await bcrypt.compare(password, user.user_password);
        if (!passwordMatch) {
            await db.release(connection);
            return res.status(401).json({ success: false, message: 'Incorrect username or password' });
        }

        // If the password is correct, return the user data without the password
        await db.release(connection);
        res.status(200).json({
            success: true,
            user_id: user.id,
            user_name: user.user_name,
            email: user.email,
            role: user.role_id,
            schedule_id: user.schedule_id,
        });

    } catch (error) {
        console.error('Error in query:', error);
        if (connection) await db.release(connection);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

