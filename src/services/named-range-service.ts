import { Map } from 'core-js/library';
import { Dimensions } from '../models/dimensions';
import { RangeService } from './range-service';

export class NamedRangeService {
  private namedRanges = new Map<string, GoogleAppsScript.Spreadsheet.Range>();
  private columns = new Map<string, number>();
  private dimensions = new Map<string, Dimensions>();
  constructor(private spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet) {}

  /**
   * @param {RangeNames} name only use values defined in the provided RangeNames enum
   * @returns {string[][]} values of range; dimensions are arr[row][column]
   * @memberof NamedRangeService
   */
  public getRange(name: RangeNames) {
    return this.getDisplayValues(name);
  }

  public getRangeAs<T>(name: RangeNames) {
    return this.getValuesAsAny(name) as T[][];
  }

  public getRanges(names: RangeNames[]) {
    const map = new Map<RangeNames, string[][]>();
    names.forEach(name => {
      const values = this.getDisplayValues(name);
      if (values != null) {
        map.set(name, values);
      }
    });
    return map;
  }

  /**
   * @param {RangeNames} name
   * @returns the column of NamedRange or -1 if not found
   * @memberof NamedRangeService
   */
  public getColumn(name: RangeNames) {
    if (this.getRangeIfNotLoaded(name)) {
      this.getColumnIfNotLoaded(name);
      return this.columns.get(name);
    }
    return -1;
  }

  private getColumnIfNotLoaded(name: RangeNames) {
    if (!this.columns.has(name)) {
      this.columns.set(name, this.namedRanges.get(name).getColumn());
    }
  }

  public getDimensions(name: RangeNames) {
    if (this.getRangeIfNotLoaded(name)) {
      this.loadDimensions(name);
      return this.dimensions.get(name);
    }
    return null;
  }

  private loadDimensions(name: RangeNames) {
    if (!this.dimensions.has(name)) {
      const range = this.namedRanges.get(name);
      this.dimensions.set(
        name,
        new Dimensions(
          range.getRow() - 1,
          range.getColumn() - 1,
          range.getHeight(),
          range.getWidth()
        )
      );
    }
  }

  public getBgColors(name: RangeNames) {
    if (this.getRangeIfNotLoaded(name)) {
      return this.namedRanges.get(name).getBackgrounds();
    }
    return null;
  }

  private getDisplayValues(name: RangeNames) {
    if (this.getRangeIfNotLoaded(name)) {
      return this.namedRanges.get(name).getDisplayValues();
    }
    return null;
  }

  private getValuesAsAny(name: RangeNames) {
    if (this.getRangeIfNotLoaded(name)) {
      return this.namedRanges.get(name).getValues() as any[][];
    }
    return null;
  }

  /**
   * You are responsible that no previous values are overwritten that shouldn't be.
   * This function will fit the dimensions of values to size of target range, thus
   * clipping any values beyond those dimensions and padding with '' to fit.
   *
   * @param {string} name name of NamedRange
   * @param {any[][]} values values to write to range
   * @memberof NamedRangeService
   */
  public setRange(name: RangeNames, values: any[][]) {
    if (this.getRangeIfNotLoaded(name)) {
      const range = this.namedRanges.get(name);
      const height = range.getHeight();
      const width = range.getWidth();
      RangeService.fitValuesToSize(values, height, width);
      range.setValues(values);
    }
  }

  public setRanges(ranges: Map<RangeNames, string[][]>) {
    ranges.forEach((values, name) => {
      this.setRange(name, values);
    });
  }

  /**
   * loads NamedRange into namedRanges if it exists
   *
   * @private
   * @param {RangeNames} name
   * @returns true if spreadsheet contains NamedRange
   * @memberof NamedRangeService
   */
  private getRangeIfNotLoaded(name: RangeNames) {
    if (!this.namedRanges.has(name)) {
      const range = this.spreadsheet.getRangeByName(name);
      if (range == null) {
        return false;
      }
      this.namedRanges.set(name, range);
    }
    return true;
  }
}

export const enum RangeNames {
  AssetHidden = 'AssetHidden',
  AssetHP = 'AssetHP',
  AssetLocations = 'AssetLocations',
  AssetMaxHPToUpkeep = 'AssetMaxHPToUpkeep',
  AssetNames = 'AssetNames',
  AssetNotes = 'AssetNotes',
  AssetOwnersAndNames = 'AssetOwnersAndNames',
  AssetTypes = 'AssetTypes', // W/C/F
  FactionAssets = 'FactionAssets',
  FactionBalances = 'FactionBalances',
  FactionGoals = 'FactionGoals',
  FactionGoalsToRelationships = 'FactionGoalsToRelationships',
  FactionHP = 'FactionHP',
  FactionIncomes = 'FactionIncomes',
  FactionLocations = 'FactionLocations',
  FactionMaxHPToUpkeep = 'FactionMaxHPToUpkeep',
  FactionNames = 'FactionNames',
  FactionNotes = 'FactionNotes',
  FactionStats = 'FactionStats',
  FactionTags = 'FactionTags',
  FactionTurns = 'FactionTurns',
  FactionTurnsFactions = 'FactionTurnsFactions',
  LookupAssetDetails = 'LookupAssetDetails',
  LookupAssetNotes = 'LookupAssetNotes',
  LookupAssets = 'LookupAssets',
  LookupFactionTags = 'LookupFactionTags',
  LookupFactionXP = 'LookupFactionXP',
  LookupFactionGoals = 'LookupFactionGoals',
  LookupThemes = 'LookupThemes',
  SystemCoords = 'SystemCoords',
  SystemCoordsRepresentation = 'SystemCoordsRepresentation',
  SystemEntities = 'SystemEntities',
  SystemNames = 'SystemNames'
}
