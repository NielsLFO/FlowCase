// api/update_row.js
import db from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const { row_id, data } = req.body;

    if (!row_id) {
        return res.status(400).json({ success: false, message: 'El ID de la fila es obligatorio.' });
    }

    let connection;

    try {
        // Obtener una conexión del pool
        connection = await db.acquire();

        // Verificar que todos los valores no sean undefined
        const values = [
            data.task_id, 
            data.type_id, 
            data.alias, 
            data.commment, 
            data.row_status, 
            data.start_time, 
            data.end_time, 
            data.totalTime, 
            data.role_id, 
            row_id
        ];

        const [result] = await connection.execute(
            `UPDATE daily_reports 
             SET task_id = ?, type_id = ?, alias = ?, commment = ?, row_status = ?, start_time = ?, end_time = ?, total_time = ?, role_id = ? 
             WHERE id = ?`,
            values
        );

        if(data.start_time !== data.pre_row_end_time && data.pre_row_end_time !== null){
            const startTime = new Date(data.pre_row_start_time);
            const endTime = new Date(data.start_time);
            const timeDifference = endTime - startTime;
            const elapsedMinutes = Math.floor(timeDifference / 60000);

            const [result_pre] = await connection.execute(
                `UPDATE daily_reports 
                 SET end_time = ?, total_time = ?
                 WHERE id = ?
            `,[data.start_time, elapsedMinutes, data.pre_row_id]);
        }

        if(data.end_time !== data.next_row_star_time && data.next_row_star_time !== null){

            const startTime = new Date(data.end_time);
            const endTime = new Date(data.next_row_end_time);
            const timeDifference = endTime - startTime;
            
            const elapsedMinutes = Math.floor(timeDifference / 60000);

            const [result_next] = await connection.execute(
                `UPDATE daily_reports 
                 SET start_time = ?, total_time = ?
                 WHERE id = ?
            `,[data.end_time, elapsedMinutes, data.next_row_id]);
        }

        await db.release(connection);

        if (result.affectedRows > 0) {
            res.status(200).json({ success: true });
        } else {
            res.status(404).json({ success: false, message: 'Registro no encontrado.' });
        }
    } catch (error) {
        console.error('Error al actualizar el registro:', error);
        if (connection) await db.release(connection);
        res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }
}
