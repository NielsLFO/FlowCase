import db from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const { task_id } = req.body;
    let connection;

    try {
        // Adquiere una conexión del pool usando `generic-pool`
        connection = await db.acquire();
        let types = [];

        // Consultar los tipos de opciones para la primera tarea
        const [typeRows] = await connection.query(`
            SELECT id, type_value, task_id 
            FROM type_options 
            WHERE task_id = ?
            `, [task_id]);

        types = typeRows.map(row => ({
            id: row.id,
            type_value: row.type_value
        }));


        await db.release(connection);
        return res.status(200).json({ success: true, types });

    } catch (error) {
        console.error('Error en la consulta:', error);
        if (connection) await db.release(connection);
        return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
}