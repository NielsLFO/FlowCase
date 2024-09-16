import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

export const getAuthUrl = () => {
    const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
    return oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    });
};

export const getAccessToken = async () => {
    // Aquí deberías implementar lógica para obtener el token de acceso
    // utilizando el código de autorización obtenido en el callback de OAuth
    // Para simplificar, puedes manejar esto en tu entorno de desarrollo.
};

export const getUserListFromSheet = async () => {
    try {
        const tokens = await getAccessToken();
        oAuth2Client.setCredentials(tokens);

        const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: 'your_spreadsheet_id',
            range: 'User list!C:D',
        });

        return response.data.values;
    } catch (error) {
        console.error('Error al obtener datos de Google Sheets:', error);
        throw error;
    }
};
