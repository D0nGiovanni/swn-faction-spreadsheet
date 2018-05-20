import { NamedRangeService, RangeNames } from './services/named-range-service';

/**
 * these ranges must not have any columns that contain critical formulae.
 * the order of importing is important because of data validation.
 * e.g. importing AssetOwnerAndName before FactionNames throws an error
 */
const importRangeNames: RangeNames[] = [
  RangeNames.SystemNames,
  RangeNames.SystemCoords,
  RangeNames.SystemEntities,
  RangeNames.FactionBalances,
  RangeNames.FactionGoalsToRelationships,
  RangeNames.FactionHP,
  RangeNames.FactionLocations,
  RangeNames.FactionNames,
  RangeNames.FactionNotes,
  RangeNames.FactionStats,
  RangeNames.FactionTags,
  RangeNames.FactionTurns,
  RangeNames.AssetHidden,
  RangeNames.AssetHP,
  RangeNames.AssetLocations,
  RangeNames.AssetOwnersAndNames
];

export class CampaignImporter {
  constructor(private namedRangeService: NamedRangeService) {}

  public import(
    otherSpreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet
  ): void {
    const otherSheetRangeService = new NamedRangeService(otherSpreadsheet);
    const target = otherSheetRangeService.getRanges(importRangeNames);
    const ownersAndNames = RangeNames.AssetOwnersAndNames;
    if (!target.has(ownersAndNames)) {
      const values = otherSheetRangeService.getRange(
        'AssetOwnerAndName' as RangeNames
      );
      target.set(ownersAndNames, values);
    }
    this.namedRangeService.setRanges(target);
  }
}
