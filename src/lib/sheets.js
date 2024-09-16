// src/lib/sheets.js
export const loadClient = (accessToken, spreadsheetId, range) => {
    if (typeof window !== "undefined") {
        import('gapi-script').then((gapi) => {
            gapi.load('client', () => {
                gapi.client.setApiKey(accessToken);
                gapi.client.load('sheets', 'v4', () => {
                    gapi.client.sheets.spreadsheets.values.get({
                        spreadsheetId: spreadsheetId,
                        range: range,
                    }).then(response => {
                        console.log(response.result);
                    });
                });
            });
        });
    }
};

