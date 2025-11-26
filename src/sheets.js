const GoogleSheets = (google) => {
  const sheets = google.sheets('v4');
  return {
    getSheetInfo: (params) => sheets.spreadsheets.get(params),
    getSheetValues: (params) => sheets.spreadsheets.values.get(params),
    updateSheetValues: (params) => sheets.spreadsheets.values.update(params),
    clearSheetValues: (params) => sheets.spreadsheets.values.clear(params),
  };
};

module.exports = GoogleSheets;
