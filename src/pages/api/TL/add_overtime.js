import db from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const overtimeData = req.body;

    // Validar que los datos de entrada sean un array
    if (!Array.isArray(overtimeData) || overtimeData.length === 0) {
        return res.status(400).json({ success: false, message: 'Invalid data format. Expected an array.' });
    }

    let connection;

    try {
        // Adquirir conexión a la base de datos
        connection = await db.acquire();

        // Preparar la consulta para insertar múltiples filas
        const query = `
            INSERT INTO overtime (user_id, option, row_date, start_time, end_time, comments)
            VALUES ?
        `;

        // Mapear los datos de entrada para ajustarlos al formato esperado
        const values = overtimeData.map((row) => [
            row.user,    // user_id
            row.option,  // option
            row.date,    // row_date
            row.start,   // start_time
            row.end,     // end_time
            row.comments // comments
        ]);

        // Ejecutar la consulta
        const [result] = await connection.query(query, [values]);

        // Liberar la conexión
        await db.release(connection);

        // Enviar respuesta al cliente
        res.status(201).json({
            success: true,
            message: 'Overtime records inserted successfully.',
            insertedRows: result.affectedRows,
        });
    } catch (error) {
        console.error('Error al insertar overtime:', error);

        // Liberar la conexión en caso de error
        if (connection) {
            await db.release(connection);
        }

        res.status(500).json({ success: false, message: 'Server error.' });
    }
}
