import {
  BooleanDocumentPropertyService,
  OverwriteNoteProperty,
  AutoNoteProperty
} from './boolean-document-property-service';
import { NamedRangeService, RangeNames } from './named-range-service';
import { NoteLookup } from './note-lookup';
export class NoteWriter {
  constructor(
    private docPropService: BooleanDocumentPropertyService,
    private namedRangeService: NamedRangeService,
    private noteLookup: NoteLookup
  ) {}

  updateNotes(
    range: GoogleAppsScript.Spreadsheet.Range,
    forceUpdate: boolean = false
  ): void {
    // We're very lazy. We make absolutely sure, we need to do the work before we start.
    if (range == null) return;
    if (!(forceUpdate || this.docPropService.get(AutoNoteProperty))) return;

    const canOverwriteNote = this.docPropService.get(OverwriteNoteProperty);
    const sheetName = range.getSheet().getName();
    var rangeData = new RangeData();
    rangeData.colOffset = range.getColumn();
    rangeData.contents = range.getDisplayValues();
    rangeData.notes = range.getNotes();
    rangeData.width = rangeData.notes[0].length;

    switch (sheetName) {
      case ValidSheets.FactionTracker:
        this.writeNotesInColumn(
          rangeData,
          this.namedRangeService.getColumn(RangeNames.FactionTags),
          val => this.noteLookup.getFactionTag(val),
          canOverwriteNote
        );
        this.writeNotesInColumn(
          rangeData,
          this.namedRangeService.getColumn(RangeNames.FactionGoals),
          val => this.noteLookup.getFactionGoal(val),
          canOverwriteNote
        );
        break;
      case ValidSheets.AssetTracker:
        this.writeNotesInColumn(
          rangeData,
          this.namedRangeService.getColumn(RangeNames.AssetNames),
          val => this.noteLookup.getAssetDetails(val),
          canOverwriteNote
        );
        this.writeNotesInColumn(
          rangeData,
          this.namedRangeService.getColumn(RangeNames.AssetNotes),
          val => this.noteLookup.getAssetNote(val),
          canOverwriteNote
        );
        break;
      default:
        return;
    }
    range.setNotes(rangeData.notes);
  }
  /**
   * Update notes in column at targetOffset if in range
   *
   * @private
   * @param {RangeData} rangeData
   * @param {number} targetOffset absolute column of target that wants to add notes
   * @param {(n: string) => string} lookupNote callback takes cell value, returns note for value
   * @param {boolean} canOverwrite
   * @memberof NoteWriter
   */
  private writeNotesInColumn(
    rangeData: RangeData,
    targetOffset: number,
    lookupNote: (n: string) => string,
    canOverwrite: boolean
  ) {
    if (this.isInRange(targetOffset, rangeData.colOffset, rangeData.width)) {
      // update notes - lookup note with contents value and write result to notes
      const relativeColumn = targetOffset - rangeData.colOffset;
      rangeData.notes.forEach((note, row) => {
        // canOverwrite needs to be here; based on whether note is present or not
        if (!canOverwrite && note[relativeColumn] != '') return;
        note[relativeColumn] = lookupNote(
          rangeData.contents[row][relativeColumn]
        );
      });
    }
  }

  private isInRange(
    target: number,
    rangeOffset: number,
    width: number
  ): boolean {
    return target >= rangeOffset && target < rangeOffset + width;
  }
}

// Cells that are allowed to have notes attached are only in these sheets
// Allowed are: tags, goals, assets, and asset notes
const enum ValidSheets {
  FactionTracker = 'FactionTracker',
  AssetTracker = 'AssetTracker'
}

class RangeData {
  contents: string[][];
  notes: string[][];
  colOffset: number;
  width: number;
}
