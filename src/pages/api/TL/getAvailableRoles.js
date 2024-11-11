import db from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    let connection;

    try {
        // Adquiere una conexión del pool usando `generic-pool`
        connection = await db.acquire();

        // Consultar el rol del usuario
        const [roleRows] = await connection.query('SELECT id, role_name FROM roles');
        
        if (roleRows.length > 0) {
            await db.release(connection);
            return res.status(200).json({ success: true, roleRows });
        } else {
            await db.release(connection);
            return res.status(404).json({ success: false, message: 'Rol no encontrado' });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        if (connection) await db.release(connection);
        return res.status(500).json({ success: false, message: 'Error en el servidor' });
    } 
}
