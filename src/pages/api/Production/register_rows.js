import db from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const {
        user_id,
        row_date,
        task_id,
        type_id,
        alias,
        commment,
        row_status,
        start_time,
        total_time,
        role_id,
    } = req.body;

    let connection;
    try {
        // Acquire a connection from the pool
        connection = await db.acquire();

        // Obtener la fecha actual en formato YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0];

        // Consultar si existe un registro de overtime para el user_id y fecha actual
        const [overtimeResult] = await connection.query(
            `SELECT type_time, start_time, end_time 
             FROM overtime 
             WHERE user_id = ? AND overtime_date = ?`,
            [user_id, today]
        );

        // Determinar el valor de type_case
        let type_case = 'Normal';

        if (overtimeResult.length > 0) {
            // Verificar si el registro actual cae dentro del rango de horas del overtime/reposition
            const currentStartTime = start_time; // Hora inicio del registro que se va a insertar

            for (const overtime of overtimeResult) {
                const { type_time, start_time: otStartTime, end_time: otEndTime } = overtime;

                if (currentStartTime >= otStartTime && currentStartTime <= otEndTime) {
                    type_case = type_time;
                    break;
                }
            }
        }

        // Insertar el nuevo registro en la tabla daily_reports con el valor correcto de type_case
        const [result] = await connection.query(`
            INSERT INTO daily_reports 
                (user_id, row_date, task_id, type_id, alias, commment, row_status, start_time, total_time, role_id, type_case)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            user_id,
            row_date,
            task_id,
            type_id,
            alias,
            commment,
            row_status,
            start_time,
            total_time,
            role_id,
            type_case
        ]);

        // Release connection back to the pool
        await db.release(connection);
        
        res.status(201).json({ success: true, insertId: result.insertId, type_case });
    } catch (error) {
        console.error('Error al insertar el registro:', error);
        await db.release(connection);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

