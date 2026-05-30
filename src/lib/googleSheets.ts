import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// Inisialisasi Auth JWT
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
  ],
});

export const getGoogleSheet = async () => {
  const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID as string, serviceAccountAuth);
  await doc.loadInfo(); // Loads document properties and worksheets
  return doc;
};
