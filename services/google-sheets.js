const dotenv = require("dotenv");
const { google } = require("googleapis");

dotenv.config();


const GOOGLE_CONFIG = JSON.parse(process.env.GOOGLE_CONFIG);

// Google sheets api
const auth = new google.auth.GoogleAuth({
    credentials: {
        project_id: GOOGLE_CONFIG.project_id,
        private_key: GOOGLE_CONFIG.private_key.replace(/\\n/g, "\n"), // Fix newlines in private key
        client_email: GOOGLE_CONFIG.client_email,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = GOOGLE_CONFIG.sheet_id;

const GoogleSheetsApi = {
    async getCategories() {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            // range: "קטגוריות!A2:A",
            //skip first row
            range: "קטגוריות",
        });
        return response.data.values;
    },

    async getCategoryById(categoryId) {
        const categories = await this.getCategories();
        return categories.find((category) => category[0] === categoryId);
    },

    async getProducts(categoryId) {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `מוצרים`,
        });
        return response.data.values;
    },

    async getOrders() {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: "הזמנות",
        });
        return response.data.values;
    }

};

module.exports = GoogleSheetsApi;