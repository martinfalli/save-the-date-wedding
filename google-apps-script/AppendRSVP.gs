/**
 * Google Apps Script — guest list lookup + RSVP row updates.
 *
 * Sheet1 columns: Name | Group | Date | Songs | Message | RSVP | Vegetarian | Guest Name | Transport
 *   Column H (Guest Name) is filled for "+1" placeholder rows when the guest's name is provided.
 *   Column I (Transport) is written only to the submitter's row.
 *   - Columns A & B are pre-populated with all guests before anyone RSVPs.
 *   - Columns C–G are filled in by doPost when a guest submits.
 *
 * 1. Open the spreadsheet → Extensions → Apps Script → paste this file → Save.
 * 2. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 3. Copy the Web App URL into .env as VITE_GOOGLE_SHEET_URL.
 * 4. After any code change: Manage deployments → Edit → New version → Deploy.
 */
const SPREADSHEET_ID = '1p_GcfiwWL5UhKeDkZbjm936lw9d4piZg7wgSdKX4yZ8';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Splits a name cell like "Сиана / Сани" into ["сиана", "сани"] (lowercased, trimmed).
 * Single-name cells just return a one-element array.
 */
function cellVariants(cellValue) {
  return String(cellValue).split('/').map(function(n) { return n.trim().toLowerCase(); }).filter(Boolean);
}

/** Display name = first variant, capitalisation preserved from the cell. */
function displayName(cellValue) {
  return String(cellValue).split('/')[0].trim();
}

// ─── GET ─────────────────────────────────────────────────────────────────────

/**
 * ?action=list&name=…
 * Finds the guest by first name (falling back to full name when duplicates exist).
 * Name cells may contain alternatives separated by " / " (e.g. "Сиана / Сани");
 * all alternatives are searched but only the first (primary) name is returned.
 */
function doGet(e) {
  const p = e.parameter || {};

  if (p.action === 'list') {
    const inputName  = String(p.name || '').trim();
    const inputFirst = inputName.split(' ')[0].toLowerCase();
    const inputFull  = inputName.toLowerCase();

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
    const rows  = sheet.getDataRange().getValues().slice(1); // skip header

    // Rows where any name variant's first word matches the input first name
    const firstMatches = rows.filter(function(row) {
      return cellVariants(row[0]).some(function(v) {
        return v.split(' ')[0] === inputFirst;
      });
    });

    var matchedRow = null;
    if (firstMatches.length === 1) {
      matchedRow = firstMatches[0];
    } else if (firstMatches.length > 1) {
      // Multiple cells share that first name — require a full-name match
      matchedRow = rows.find(function(row) {
        return cellVariants(row[0]).some(function(v) { return v === inputFull; });
      }) || null;
      if (!matchedRow) {
        return json({ found: false, reason: 'ambiguous' });
      }
    }

    if (!matchedRow) {
      return json({ found: false, reason: 'notfound' });
    }

    const group = String(matchedRow[1]);
    const members = rows
      .filter(function(row) { return String(row[1]) === group; })
      .map(function(row) {
        const raw     = String(row[0]).trim();
        const isPlus1 = raw.endsWith('+1');
        return {
          name:         isPlus1 ? '+1' : displayName(row[0]).split(' ')[0],
          sheetName:    raw,      // sent back by the browser so doPost can match exactly
          isPlus1:      isPlus1,
          alreadyRsvpd: String(row[5]).trim() !== '',
        };
      });

    return json({ found: true, members: members });
  }

  // Legacy duplicate check
  if (p.action === 'check') {
    const inputFull = String(p.name || '').toLowerCase().trim();
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
    const rows  = sheet.getDataRange().getValues().slice(1);
    const exists = rows.some(function(row) {
      return cellVariants(row[0]).some(function(v) { return v === inputFull; })
        && String(row[5]).trim() !== '';
    });
    return json({ exists: exists });
  }

  return json({ ok: true });
}

// ─── POST ────────────────────────────────────────────────────────────────────

/**
 * Finds each group member's existing row by name and updates columns C–G.
 * Songs & Message are written only to the submitter's row.
 */
function doPost(e) {
  try {
    const p        = e.parameter || {};
    const sheet    = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
    const rows     = sheet.getDataRange().getValues().slice(1); // skip header

    const date      = p.date      || new Date().toISOString();
    const submitter = String(p.submitter || '').toLowerCase().trim();
    const songs     = p.songs     || '';
    const message   = p.message   || '';
    const transport = p.transport || '';
    const members   = JSON.parse(p.members || '[]');

    members.forEach(function(member) {
      // Prefer the exact sheetName key the browser echoed back; fall back to display name
      const matchKey = String(member.sheetName || member.name || '').toLowerCase().trim();
      const rowIdx = rows.findIndex(function(row) {
        return String(row[0]).trim().toLowerCase() === matchKey
          || cellVariants(row[0]).some(function(v) { return v === matchKey; });
      });
      if (rowIdx === -1) return;

      const sheetRow    = rowIdx + 2; // +1 for header, +1 for 1-based index
      const isSubmitter = cellVariants(rows[rowIdx][0]).some(function(v) { return v === submitter; });

      sheet.getRange(sheetRow, 3).setValue(date);
      sheet.getRange(sheetRow, 4).setValue(isSubmitter ? songs     : '');
      sheet.getRange(sheetRow, 5).setValue(isSubmitter ? message   : '');
      sheet.getRange(sheetRow, 6).setValue(member.rsvp);
      sheet.getRange(sheetRow, 7).setValue(member.vegetarian);
      sheet.getRange(sheetRow, 8).setValue(member.guestName || '');
      sheet.getRange(sheetRow, 9).setValue(member.rsvp === 'Yes' ? transport : '');
    });

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Run once from the editor to verify sheet access */
function testAppend() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
  Logger.log('First row: ' + sheet.getRange(1, 1, 1, 7).getValues());
}
