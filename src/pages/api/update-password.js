import { google } from 'googleapis';
import path from 'path';

async function authenticateSheets() {
    const auth = new google.auth.GoogleAuth({
        keyFile: path.join(process.cwd(), 'credentials/service-account.json'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    return await auth.getClient();
}

export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).send({ message: 'Only POST requests allowed' });
    }

    const { username, newPassword } = req.body;

    try {
        const auth = await authenticateSheets();
        const sheets = google.sheets({ version: 'v4', auth });

        const spreadsheetId = '1MVKpqtcpIeiEuQxbyBMBsyixTLGWh08h1HmA9tDu5J8';

        // Obtener los datos de la hoja "User list"
        const userListRange = 'User list!A2:D'; // Ajusta el rango según la disposición de tu hoja
        const userListResponse = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: userListRange,
        });

        const rows = userListResponse.data.values;
        if (!rows || rows.length === 0) {
            return res.status(404).json({ success: false, message: 'No data found in spreadsheet' });
        }

        const rowIndex = rows.findIndex(row => row[2] === username);
        if (rowIndex === -1) {
            return res.status(404).json({ success: false, message: 'User not found ' + username });
        }

        const rowNumber = rowIndex + 2; // Ajuste para encabezado y 0-indexing

        // Actualizar la contraseña del usuario
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `User list!D${rowNumber}`,
            valueInputOption: 'RAW',
            resource: {
                values: [[newPassword]]
            },
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error during operation:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
