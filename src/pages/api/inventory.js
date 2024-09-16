import { google } from 'googleapis';
import path from 'path';

async function authenticateSheets() {
    const auth = new google.auth.GoogleAuth({
        keyFile: path.join(process.cwd(), 'credentials/service-account.json'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    return await auth.getClient();
}

export default async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).send({ message: 'Only GET requests allowed' });
    }

    try {
        const auth = await authenticateSheets();
        const sheets = google.sheets({ version: 'v4', auth });

        const spreadsheetId = '1MVKpqtcpIeiEuQxbyBMBsyixTLGWh08h1HmA9tDu5J8';
        const range = 'Inventory!A2:F'; // Ajusta el rango si es necesario

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            throw new Error('No data found in spreadsheet');
        }

        const items = rows
            .map(row => ({
                id: row[0],
                name: row[1],
                description: row[2],
                points: parseInt(row[3], 10),
                image: row[4],
                quantity: parseInt(row[5], 10),
            }))
            .filter(item => item.quantity > 0);

        res.status(200).json({ success: true, items });
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

