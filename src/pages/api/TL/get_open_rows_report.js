import db from '../../../lib/db';  // Asegúrate de tener tu conexión a la base de datos configurada en db.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { tl_name } = req.body;  // Recibimos el nombre del TL desde el cuerpo de la solicitud

    let connection;

    try {
        // Adquirimos la conexión a la base de datos
        connection = await db.acquire();

        // Ejecutamos la consulta para obtener los datos de auditoría, usando el tl_name dinámicamente
        const [Data] = await connection.query(`
			SELECT dr.id, dr.user_id, u.user_name, dr.row_date, dr.task_id, t.task_name, dr.type_id, tp.type_value, dr.alias, dr.commment, dr.row_status, dr.start_time, dr.end_time, dr.total_time, dr.role_id, r.role_name
			FROM daily_reports dr
                INNER JOIN tasks t ON dr.task_id = t.id
                INNER JOIN type_options tp ON dr.type_id = tp.id
                INNER JOIN roles r ON dr.role_id = r.id
                INNER JOIN users u ON dr.user_id = u.id
                INNER JOIN tl tt ON u.tl_id = tt.id
                    WHERE tt.tl_name = ? 
                    AND row_status = "Start" 
                    AND row_date < CURDATE()
                ORDER BY dr.start_time ASC;  
        `, [tl_name]); 

        // Si hay resultados, los devolvemos al frontend
        if (Data.length > 0) {
            await db.release(connection);
            return res.status(200).json({ success: true, data: Data });
        } else {
            await db.release(connection);
            return res.status(404).json({ success: false, message: 'No audit data found' });
        }
    } catch (error) {
        console.error('Error in query:', error);
        if (connection) await db.release(connection);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}