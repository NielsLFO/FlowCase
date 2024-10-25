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
                SELECT id, task_name 
                FROM tasks 
                WHERE FIND_IN_SET(?, REPLACE(REPLACE(id_roles, '[', ''), ']', '')) > 0
            `, [role]);

            const tasks = taskRows.map(row => ({
                id: row.id,
                task_name: row.task_name
            }));

            // Consultar los tipos asociados a la primera tarea si existen tareas
            if (tasks.length > 0) {
                const [typeRows] = await db.query(`
                    SELECT id, type_value, task_id 
                    FROM type_options 
                    WHERE task_id = ? AND FIND_IN_SET(?, REPLACE(REPLACE(role_id, '[', ''), ']', '')) > 0
                `, [tasks[0].id, role]);

                const types = typeRows.map(row => ({
                    id: row.id,
                    type_value: row.type_value
                }));

                return res.status(200).json({ success: true, role, tasks, types });
            } else {
                return res.status(200).json({ success: true, role, tasks, types: [] }); // Si no hay tareas, types vacío
            }
        } else {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}
