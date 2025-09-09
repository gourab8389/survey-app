import { google } from 'googleapis';
import { SurveyForm, FormSubmission } from '@/types/form.types';

class GoogleSheetsService {
  private sheets;
  private auth;

  constructor() {
    this.auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
  }

  private getSpreadsheetId() {
    return process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;
  }

  async createFormSheet(form: SurveyForm) {
    const spreadsheetId = this.getSpreadsheetId();
    
    try {
      await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Forms!A1',
      });
    } catch (error) {
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: 'Forms',
                gridProperties: {
                  rowCount: 1000,
                  columnCount: 10
                }
              }
            }
          }]
        }
      });

      // Add headers
      await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Forms!A1:F1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [['ID', 'Title', 'Description', 'Fields', 'CreatedAt', 'UpdatedAt']]
        }
      });
    }

    // Add form data
    await this.sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Forms!A:F',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          form.id,
          form.title,
          form.description,
          JSON.stringify(form.fields),
          form.createdAt,
          form.updatedAt
        ]]
      }
    });

    // Create response sheet for this form
    await this.createResponseSheet(form);
  }

  private async createResponseSheet(form: SurveyForm) {
    const spreadsheetId = this.getSpreadsheetId();
    const sheetName = `Responses_${form.id}`;

    try {
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: sheetName,
                gridProperties: {
                  rowCount: 1000,
                  columnCount: form.fields.length + 3
                }
              }
            }
          }]
        }
      });

      // Add headers
      const headers = ['ID', 'SubmittedAt', ...form.fields.map(field => field.label)];
      await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A1:${String.fromCharCode(65 + headers.length - 1)}1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [headers]
        }
      });
    } catch (error) {
      console.error('Error creating response sheet:', error);
    }
  }

  async getAllForms(): Promise<SurveyForm[]> {
    const spreadsheetId = this.getSpreadsheetId();
    
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Forms!A2:F1000',
      });

      const rows = response.data.values || [];
      return rows.map(row => ({
        id: row[0],
        title: row[1],
        description: row[2],
        fields: JSON.parse(row[3] || '[]'),
        createdAt: row[4],
        updatedAt: row[5],
      }));
    } catch (error) {
      console.error('Error fetching forms:', error);
      return [];
    }
  }

  async getFormById(id: string): Promise<SurveyForm | null> {
    const forms = await this.getAllForms();
    return forms.find(form => form.id === id) || null;
  }

  async updateForm(form: SurveyForm) {
    const spreadsheetId = this.getSpreadsheetId();
    const forms = await this.getAllForms();
    const formIndex = forms.findIndex(f => f.id === form.id);
    
    if (formIndex === -1) return false;

    const rowIndex = formIndex + 2; // +2 because of header row and 0-based index
    
    await this.sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Forms!A${rowIndex}:F${rowIndex}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          form.id,
          form.title,
          form.description,
          JSON.stringify(form.fields),
          form.createdAt,
          form.updatedAt
        ]]
      }
    });

    return true;
  }

  async deleteForm(id: string) {
    const spreadsheetId = this.getSpreadsheetId();
    const forms = await this.getAllForms();
    const formIndex = forms.findIndex(f => f.id === id);
    
    if (formIndex === -1) return false;

    const rowIndex = formIndex + 1; // +1 because of header row
    
    await this.sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{
          deleteDimension: {
            range: {
              sheetId: 0, // Forms sheet ID
              dimension: 'ROWS',
              startIndex: rowIndex,
              endIndex: rowIndex + 1
            }
          }
        }]
      }
    });

    return true;
  }

  async submitFormResponse(submission: FormSubmission, form: SurveyForm) {
    const spreadsheetId = this.getSpreadsheetId();
    const sheetName = `Responses_${form.id}`;
    
    const values = [
      submission.id,
      submission.submittedAt,
      ...form.fields.map(field => {
        const value = submission.data[field.id];
        if (Array.isArray(value)) return value.join(', ');
        return value || '';
      })
    ];

    await this.sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:${String.fromCharCode(65 + values.length)}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [values]
      }
    });
  }
}

export const googleSheetsService = new GoogleSheetsService();