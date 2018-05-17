import { Map } from 'core-js/library';
import { NamedRangeService, RangeNames } from 'src/named-range-service';

export class NoteLookup {
  private goals: Map<string, string> = new Map<string, string>();
  private tags: Map<string, string> = new Map<string, string>();
  private assets: Map<string, string> = new Map<string, string>();
  private assetNotes: Map<string, string> = new Map<string, string>();

  constructor(private namedRangeService: NamedRangeService) {}

  getFactionGoal(goal: string): string {
    return this.getValue(this.goals, RangeNames.LookupFactionGoals, goal);
  }

  getFactionTag(tag: string): string {
    return this.getValue(this.tags, RangeNames.LookupFactionTags, tag);
  }

  getAssetDescription(asset: string): string {
    return this.getValue(this.assets, RangeNames.LookupAssetDetails, asset);
  }

  getAssetNote(note: string): string {
    return this.getValue(this.assetNotes, RangeNames.LookupAssetNotes, note);
  }

  private getValue(
    map: Map<string, string>,
    rangeName: RangeNames,
    target: string
  ): string {
    // initialize if empty - so it only has to be done once -> improves speed
    // notes are static after all
    if (map.size == 0) {
      var values = this.namedRangeService.getRange(rangeName);
      values.forEach(val => {
        map.set(val[0], val[1]);
      });
    }
    return map.get(target) || '';
  }
}
