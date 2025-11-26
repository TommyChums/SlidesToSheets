require('dotenv').config()

const forEach = require('lodash/forEach');

const {
  GetAuthGoogle,
  GoogleSheets,
  GoogleSlides,
} = require('./src');

const {
  cleanLines,
  logResponse,
} = require('./src/helpers');

const {
  MAIN_SHEET_NAME,
  NOTES_SHEET_NAME,
  PRESENTATION_ID,
  SPREADSHEET_ID,
} = process.env;

const updateMainSpreadSheetTitle = async (sheets, title) => {
  const updateParams = {
    spreadsheetId: SPREADSHEET_ID,
    range: `${MAIN_SHEET_NAME}!H2`,
    valueInputOption: 'USER_ENTERED',
    resource: {
      majorDimension: 'COLUMNS',
      values: [[title]],
    },
  };

  const resp = await sheets.updateSheetValues(updateParams)
  logResponse(resp, 'Update Main Spreadsheet Title');
};

const updateNotesSpreadSheetValues = async (sheets, values) => {
  const clearParams = {
    spreadsheetId: SPREADSHEET_ID,
    range: `${NOTES_SHEET_NAME}!A2:A9999`,
  };

  const clearResp = await sheets.clearSheetValues(clearParams)
  logResponse(clearResp, 'Clear Notes Spreadsheet Values');

  const updateParams = {
    spreadsheetId: SPREADSHEET_ID,
    range: `${NOTES_SHEET_NAME}!A2`,
    valueInputOption: 'USER_ENTERED',
    resource: {
      majorDimension: 'COLUMNS',
      values: [values],
    },
  };

  const resp = await sheets.updateSheetValues(updateParams)
  logResponse(resp, 'Update Notes Spreadsheet Values');
};

const getSlideData = async (slides) => {
  const getParams = {
    presentationId: PRESENTATION_ID,
  };

  const resp = await slides.getPresentationInfo(getParams);
  logResponse(resp, 'Retrieve Notes from slides');

  const presentationSlides = resp.data.slides;

  const values = [];
  let title = '';
  let singlePoint = '';

  forEach(presentationSlides, ({ pageElements }) => {
    forEach(pageElements, ({ shape: { placeholder, text } }) => {
      if (placeholder && placeholder.type.includes('TITLE')) {
        if (text && text.textElements) {
          forEach(text.textElements, (textElem) => {
            if (textElem && textElem.textRun && textElem.textRun.content) {
              title = cleanLines(textElem.textRun.content) || title;
            }
          });
        }
      }
      else if (text && text.textElements) {
        forEach(text.textElements, (textElem) => {
          if (textElem) {
            if (textElem.textRun) {
              singlePoint += textElem.textRun.content;
            }

            if (textElem.paragraphMarker && textElem.paragraphMarker.bullet) {
              const value = cleanLines(singlePoint) || null;
              if (value) values.push(value);
              singlePoint = '';
            }
          }
        });
      }
    });
  });

  if (cleanLines(singlePoint)) {
    values.push(singlePoint.trim());
  }

  return [values, title];
};

const Main = async () => {
  const google = await GetAuthGoogle();

  const sheets = GoogleSheets(google);
  const slides = GoogleSlides(google);

  const [values, title] = await getSlideData(slides);

  await updateNotesSpreadSheetValues(sheets, values);
  await updateMainSpreadSheetTitle(sheets, title);
};

Main().catch(logResponse);
