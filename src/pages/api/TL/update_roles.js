import db from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Ensure the request body contains "roles"
    const { roles } = req.body;
    console.log("Received roles:", roles); // Verify the received data

    if (!Array.isArray(roles)) {
        return res.status(400).json({ success: false, message: 'Roles must be an array.' });
    }

    let connection;

    try {
        // Acquire a connection from the pool
        connection = await db.acquire();

        for (const technician of roles) {
            const { name, assignedRoleId } = technician; // A single role ID per technician

            // Update the role in the database
            await connection.query(
                'UPDATE users SET role_id = ? WHERE user_name = ?',
                [assignedRoleId, name]
            );
        }

        await db.release(connection);
        return res.status(200).json({ success: true, message: 'Roles updated successfully' });

    } catch (error) {
        console.error('Error updating roles:', error);
        if (connection) await db.release(connection);
        return res.status(500).json({ success: false, message: 'Error updating roles' });
    }
}
