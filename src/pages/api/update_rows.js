// api/update_row.js
import db from '../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { rowId, ...updatedData } = req.body; 

    try {
        const result = await db.execute(
            'UPDATE daily_reports SET commment = ?, row_status = ?, end_time = ?, total_time = ?, role_id = ? WHERE id = ?',
            [updatedData.comments, updatedData.status, updatedData.end_time, updatedData.total_time, updatedData.roll, rowId]
        );

        if (result[0].affectedRows > 0) {
            res.status(200).json({ success: true });
        } else {
            res.status(404).json({ success: false, message: 'Record not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
}

