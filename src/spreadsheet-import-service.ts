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

  public import(otherSpreadsheet: Spreadsheet.Spreadsheet): void {
    const source = this.getImportRangesFromSheet(otherSpreadsheet);
    const target = this.getImportRangesFromSheet(this.spreadsheet);
    importRangeNames.forEach(rName => {
      const values = source
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
    const namedRanges = spreadsheet.getNamedRanges();
    const ranges = new Map<string, Spreadsheet.NamedRange>();
    namedRanges.forEach(range => {
      const index = importRangeNames.indexOf(range.getName());
      if (index >= 0) {
        ranges.set(importRangeNames[index], range);
      }
    });
    return ranges;
  }
}
