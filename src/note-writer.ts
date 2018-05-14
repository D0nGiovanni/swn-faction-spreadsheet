import {
  BooleanDocumentPropertyService,
  OverwriteNoteProperty,
  AutoNoteProperty
} from './boolean-document-property-service';

export class NoteWriter {
  constructor(private docPropService: BooleanDocumentPropertyService) {}

  updateNotes(range, forceUpdate: boolean = false): void {
    if (range == null) return;
    if (!(forceUpdate || this.docPropService.get(AutoNoteProperty))) return;
    var overwriteNote = this.docPropService.get(OverwriteNoteProperty);
    var height = range.getHeight();
    var width = range.getWidth();
    for (let x = 1; x <= width; ++x) {
      for (let y = 1; y <= height; ++y) {
        var cell = range.getCell(y, x);
        if (!overwriteNote && cell.getNote() != '') continue;

        /* Please note:
         * Note acquisation is done via DataValidation - is a hack, but it works.
         * In the future, if a better solution is found, this should be replaced.
         * How it works:
         * The cell content is compared to validation criteria values and the note
         * is taken from one column to the right of the corresponding criteria cell
        */

        var validation = cell.getDataValidation();
        if (this.hasRightCriteriaType(validation)) {
          this.updateNoteFromRange(cell, validation.getCriteriaValues()[0]);
        }
      }
    }
  }

  private hasRightCriteriaType(valid: any): boolean {
    return (
      valid != null &&
      valid.getCriteriaType() ==
        SpreadsheetApp.DataValidationCriteria.VALUE_IN_RANGE
    );
  }

  private updateNoteFromRange(cell, range): void {
    const targetValue = cell.getValue();
    var height = range.getHeight();
    for (var y = 1; y <= height; ++y) {
      var currentCell = range.getCell(y, 1);
      if (currentCell.getValue() == targetValue) {
        // assumes corresponding note content is one cell to the right of currentCell
        cell.setNote(currentCell.offset(0, 1).getValue());
        return;
      }
    }
  }
}
