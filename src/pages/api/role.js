import db from '../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email } = req.body;

    try {
        // Consultar el rol del usuario
        const [roleRows] = await db.query('SELECT role_id FROM users WHERE email = ?', [email]);

        if (roleRows.length > 0) {
            const role = roleRows[0].role_id;

            // Consultar las tareas asociadas al rol
            const [taskRows] = await db.query(`
                SELECT task_name 
                FROM tasks 
                WHERE FIND_IN_SET(?, REPLACE(REPLACE(id_roles, '[', ''), ']', '')) > 0
            `, [role]);

            const tasks = taskRows.map(row => row.task_name);

            res.status(200).json({ success: true, role, tasks });
        } else {
            res.status(404).json({ success: false, message: 'Role not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}
