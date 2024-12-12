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
        const [auditData] = await connection.query(`
            SELECT 
                r.alias AS alias,
                r.tech,
                d.user_name,
                d.tl_name,
                r.total_minutes AS jira_minutes,
                d.total_minutes AS daily_minutes,
                ABS(r.total_minutes - d.total_minutes) AS difference
            FROM 
                ( -- Consulta para report_jira
                    SELECT alias, tech, SUM(minutes) AS total_minutes
                    FROM report_jira
                    WHERE to_status IN ("Rework - In Progress", "In Progress", "Rework in Progress - QA")
                    GROUP BY alias, tech
                ) AS r
            JOIN 
                ( -- Consulta para daily_reports
                    SELECT dr.alias, u.user_name, tt.tl_name, SUM(dr.total_time) AS total_minutes
                    FROM daily_reports dr
                    INNER JOIN users u ON dr.user_id = u.id
                    INNER JOIN tasks t ON dr.task_id = t.id
                    INNER JOIN type_options tp ON dr.type_id = tp.id
                    INNER JOIN tl tt ON tt.id = u.tl_id
                    GROUP BY dr.alias, u.user_name, tt.tl_name
                ) AS d
            ON r.alias = d.alias
            -- Comparación de alias entre tech y user_name (primero nombre y primer apellido)
            AND LOWER(SUBSTRING_INDEX(r.tech, ' ', 2)) = LOWER(REPLACE(d.user_name, '.', ' '))
            WHERE ABS(r.total_minutes - d.total_minutes) > 20 
            AND d.tl_name = ?;  
        `, [tl_name]); 

        // Si hay resultados, los devolvemos al frontend
        if (auditData.length > 0) {
            await db.release(connection);
            return res.status(200).json({ success: true, data: auditData });
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
