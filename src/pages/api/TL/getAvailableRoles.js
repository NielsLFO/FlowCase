import db from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    let connection;

    try {
        // Acquire a connection from the pool using `generic-pool`
        connection = await db.acquire();

        // Query the user's role
        const [roleRows] = await connection.query('SELECT id, role_name FROM roles');
        
        if (roleRows.length > 0) {
            await db.release(connection);
            return res.status(200).json({ success: true, roleRows });
        } else {
            await db.release(connection);
            return res.status(404).json({ success: false, message: 'Role not found' });
        }
    } catch (error) {
        console.error('Error in query:', error);
        if (connection) await db.release(connection);
        return res.status(500).json({ success: false, message: 'Server error' });
    } 
}
