import db from '../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { user_name, oldPassword, newPassword } = req.body;

    if (!user_name || !oldPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Missing required data.' });
    }

    let connection;

    try {
        // Acquire a connection from the pool
        connection = await db.acquire();

        // Verify the current password
        const [user] = await connection.query(
            'SELECT user_password FROM users WHERE user_name = ?',
            [user_name]
        );

        if (!user || user.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const currentPassword = user[0].user_password;

        let passwordMatch;
        if (currentPassword.startsWith('$2a$') || currentPassword.startsWith('$2b$')) {
            // If the password in the database is already encrypted, use bcrypt
            passwordMatch = await bcrypt.compare(oldPassword, currentPassword);
        } else {
            // If the password is in plain text, compare directly
            passwordMatch = oldPassword === currentPassword;
        }

        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'The current password is incorrect.' });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database with the encrypted version
        await connection.query(
            'UPDATE users SET user_password = ? WHERE user_name = ?',
            [hashedNewPassword, user_name]
        );

        await db.release(connection);
        return res.status(200).json({ success: true, message: 'Password updated successfully' });

    } catch (error) {
        console.error('Error updating password:', error);
        if (connection) await db.release(connection);
        return res.status(500).json({ success: false, message: 'Error updating password' });
    }
}
