/**
 * Google Apps Script — append RSVP rows to your sheet.
 *
 * 1. Open the spreadsheet → Extensions → Apps Script → paste this file → Save.
 * 2. Deploy → New deployment → Select type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone (required for the public site to POST)
 * 3. Copy the Web App URL (ends with /exec).
 * 4. In the project root (NOT dist/), create .env:
 *    VITE_GOOGLE_SHEET_URL=https://script.google.com/macros/s/.../exec
 * 5. npm run dev / npm run build
 *
 * Sheet row 1: Date | Name | Songs | Message | RSVP | Vegetarian
 * Date values look like: 2026-03-31 22:50:24 (local time from the browser)
 */
const SPREADSHEET_ID = '1p_GcfiwWL5UhKeDkZbjm936lw9d4piZg7wgSdKX4yZ8';

function doPost(e) {
  try {
    const p = e.parameter || {};
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
    sheet.appendRow([
      p.date || new Date().toISOString(),
      p.name || '',
      p.songs || '',
      p.message || '',
      p.rsvp || '',
      p.vegetarian || '',
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * GET ?action=check&name=...
 * Returns { exists: true/false } — used by the front-end to detect duplicate submissions.
 * Performs a case-insensitive match on the Name column (column B, index 1).
 */
function doGet(e) {
  const p = e.parameter || {};
  if (p.action === 'check') {
    const name = String(p.name || '').toLowerCase().trim();
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
    const rows = sheet.getDataRange().getValues().slice(1); // skip header
    const exists = rows.some(row => String(row[1]).toLowerCase().trim() === name);
    return ContentService.createTextOutput(JSON.stringify({ exists }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Optional: run once from the editor to verify the sheet opens */
function testAppend() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
  sheet.appendRow([new Date().toISOString(), 'test', '', '', 'Yes', '']);
}
