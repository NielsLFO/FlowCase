import db from '../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { task_id, role_id } = req.body;

    try {
        // Consultar los tipos asociados a la tarea y al rol
        const [typeRows] = await db.query(`
            SELECT id, type_value 
            FROM type_options 
            WHERE task_id = ? 
            AND FIND_IN_SET(?, REPLACE(REPLACE(role_id, '[', ''), ']', '')) > 0
        `, [task_id, role_id]);

        // Mapear para obtener tanto el id como el valor del tipo
        const types = typeRows.map(row => ({
            id: row.id,
            type_value: row.type_value
        }));

        res.status(200).json({ success: true, types });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}
