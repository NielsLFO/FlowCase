// pages/api/users/validate.js
import { getSheetData } from '@/lib/sheets';

async function validateUser(username, password) {
    const data = await getSheetData();

    // Search for the user in the sheet data
    for (let row of data) {
        if (row[0] === username && row[1] === password) {
            return true;
        }
    }
    return false;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { username, password } = req.body;

    try {
        const isValidUser = await validateUser(username, password);
        if (isValidUser) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}



