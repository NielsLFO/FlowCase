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

    const { username } = req.body;

    try {
        const auth = await authenticateSheets();
        const sheets = google.sheets({ version: 'v4', auth });

        const spreadsheetId = '1MVKpqtcpIeiEuQxbyBMBsyixTLGWh08h1HmA9tDu5J8';
        const ordersRange = 'Orders!A2:E';

        const ordersResponse = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: ordersRange,
        });

        const rows = ordersResponse.data.values;
        if (!rows || rows.length === 0) {
            return res.status(404).json({ success: false, message: 'No data found in orders sheet' });
        }

        const userHistory = rows
            .filter(row => row[0] === username)
            .map(row => ({
                itemName: row[2],
                itemPoints: row[1],
                date: row[3],
                status: row[4].toLowerCase() === 'true' ? 'Delivered' : 'Pending',
            }));

        res.status(200).json({ success: true, history: userHistory });
    } catch (error) {
        console.error('Error fetching user history:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
