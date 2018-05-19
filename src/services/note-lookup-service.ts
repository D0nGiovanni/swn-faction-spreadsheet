import { Map } from 'core-js/library';
import { NamedRangeService, RangeNames } from './named-range-service';

export class NoteLookupService {
  private goals: Map<string, string> = new Map<string, string>();
  private tags: Map<string, string> = new Map<string, string>();
  private assets: Map<string, string> = new Map<string, string>();
  private assetNotes: Map<string, string> = new Map<string, string>();

  constructor(private namedRangeService: NamedRangeService) {}

  public getFactionGoal(target: string): string {
    return this.getValue(this.goals, RangeNames.LookupFactionGoals, target);
  }

  public getFactionTag(target: string): string {
    return this.getValue(this.tags, RangeNames.LookupFactionTags, target);
  }

  public getAssetDetails(target: string): string {
    return this.getValue(this.assets, RangeNames.LookupAssetDetails, target);
  }

  public getAssetNote(target: string): string {
    return this.getValue(this.assetNotes, RangeNames.LookupAssetNotes, target);
  }

  private getValue(
    map: Map<string, string>,
    rangeName: RangeNames,
    target: string
  ): string {
    // initialize if empty - so it only has to be done once -> improves speed
    // notes are static after all
    if (map.size === 0) {
      const values = this.namedRangeService.getRange(rangeName);
      values.forEach(val => {
        map.set(val[0], val[1]);
      });
    }
    return map.get(target) || '';
  }
}
