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
    if (req.method !== 'POST') {
        return res.status(405).send({ message: 'Only POST requests allowed' });
    }

    const { username } = req.body;

    try {
        const auth = await authenticateSheets();
        const sheets = google.sheets({ version: 'v4', auth });

        const spreadsheetId = '1MVKpqtcpIeiEuQxbyBMBsyixTLGWh08h1HmA9tDu5J8';
        const range = 'User list!A2:E'; 

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });

        const rows = response.data.values;
        if (!rows) {
            throw new Error('No data found in spreadsheet');
        }

        const user = rows.find(row => row[2] === username);

        if (user) {
            const points = parseInt(user[4], 10);
            res.status(200).json({ success: true, points });
        } else {
            res.status(401).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
