import { Map } from 'core-js/library';

export class NamedRangeService {
  namedRanges = new Map<string, GoogleAppsScript.Spreadsheet.Range>();
  columns = new Map<string, number>();

  constructor(private spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet) {}

  /**
   * @param {string} name only use values defined in the provided RangeNames enum
   * @returns {string[][]} values of range; dimensions are arr[row][column]
   * @memberof NamedRangeService
   */
  getRange(name: string): string[][] {
    return this.getValues(name);
  }

  getRanges(names: string[]): Map<string, string[][]> {
    const map = new Map<string, string[][]>();
    names.forEach(val => map.set(val, this.getValues(val)));
    return map;
  }

  getColumn(name: string) {
    this.getRangeIfNotExists(name);
    this.getColumnIfNotExists(name);
    return this.columns.get(name);
  }

  private getColumnIfNotExists(name: string) {
    if (!this.columns.has(name)) {
      this.columns.set(name, this.namedRanges.get(name).getColumn());
    }
  }

  private getValues(name: string): string[][] {
    this.getRangeIfNotExists(name);
    return this.namedRanges.get(name).getDisplayValues();
  }

  /**
   * You are responsible that no previous values are overwritten that shouldn't be.
   * This function will fit the dimensions of values to size of target range, thus
   * clipping any values beyond those dimensions and padding with '' to fit.
   *
   * @param {string} name name of NamedRange
   * @param {string[][]} values values to write to range
   * @memberof NamedRangeService
   */
  set(name: string, values: string[][]) {
    this.getRangeIfNotExists(name);
    const range = this.namedRanges.get(name);
    const height = range.getHeight();
    const width = range.getWidth();
    this.fitValuesToSize(values, height, width);
    range.setValues(values);
  }

  private fitValuesToSize(values: string[][], height: number, width: number) {
    while (values.length < height) values.push(['']);
    while (values.length > height) values.pop();
    values.forEach(row => {
      while (row.length < width) row.push('');
      while (row.length > width) row.pop();
    });
  }

  private getRangeIfNotExists(name: string) {
    if (!this.namedRanges.has(name)) {
      this.namedRanges.set(name, this.spreadsheet.getRangeByName(name));
    }
  }
}

export const enum RangeNames {
  AssetHidden = 'AssetHidden',
  AssetHP = 'AssetHP',
  AssetLocation = 'AssetLocation',
  AssetNote = 'AssetNote',
  AssetOwnerAndName = 'AssetOwnerAndName',
  FactionBalance = 'FactionBalance',
  FactionGoals = 'FactionGoals',
  FactionGoalsToRelationship = 'FactionGoalsToRelationship',
  FactionHP = 'FactionHP',
  FactionIncome = 'FactionIncome',
  FactionLocation = 'FactionLocation',
  FactionNames = 'FactionNames',
  FactionNotes = 'FactionNotes',
  FactionStats = 'FactionStats',
  FactionTags = 'FactionTags',
  FactionTurns = 'FactionTurns',
  LookupAssetDetails = 'LookupAssetDetails',
  LookupAssetNotes = 'LookupAssetNotes',
  LookupAssets = 'LookupAssets',
  LookupFactionTags = 'LookupFactionTags',
  LookupFactionXP = 'LookupFactionXP',
  LookupFactionGoals = 'LookupFactionGoals',
  SystemCoords = 'SystemCoords',
  SystemEntities = 'SystemEntities',
  SystemNames = 'SystemNames'
}
