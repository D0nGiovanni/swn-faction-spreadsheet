import Spreadsheet = GoogleAppsScript.Spreadsheet;
// the 'Import' prefix signifies that the ranges are used from importing
// These ranges must not have any columns that contain critical formulas
const importRangeNames: string[] = [
  'AssetHidden',
  'AssetHP',
  'AssetLocation',
  'AssetOwnerAndName',
  'FactionFacCredsToNotes',
  'FactionHP',
  'FactionNames',
  'FactionStats',
  'FactionTurns',
  'SystemCoords',
  'SystemEntities',
  'SystemNames'
];

export class SpreadsheetImportService {
  constructor(private spreadsheet: Spreadsheet.Spreadsheet) {}

  import(otherSpreadsheet: Spreadsheet.Spreadsheet): void {
    var source = this.getImportRangesFromSheet(otherSpreadsheet);
    var target = this.getImportRangesFromSheet(this.spreadsheet);
    importRangeNames.forEach(rName => {
      let values = source
        .get(rName)
        .getRange()
        .getValues();
      target
        .get(rName)
        .getRange()
        .setValues(values);
    });
  }

  private getImportRangesFromSheet(
    spreadsheet: Spreadsheet.Spreadsheet
  ): Map<string, Spreadsheet.NamedRange> {
    var namedRanges = spreadsheet.getNamedRanges();
    var ranges = new Map<string, Spreadsheet.NamedRange>();
    for (let i = 0; i < namedRanges.length; i++) {
      let range = namedRanges[i];
      let index = importRangeNames.indexOf(range.getName());
      if (index >= 0) ranges.set(importRangeNames[index], range);
    }
    return ranges;
  }
}
