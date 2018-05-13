import {
  BooleanDocumentPropertyService,
  OverwriteNoteProperty,
  AutoNoteProperty
} from './boolean-document-property-service';

export class NoteWriter {
  constructor(private docPropService: BooleanDocumentPropertyService) {}

  updateNotes(range, forceUpdate: boolean = false): void {
    if (range == null) return;
    SpreadsheetApp.getActiveSpreadsheet().toast('hi');
    if (!(forceUpdate || this.docPropService.get(AutoNoteProperty))) return;
    var overwriteNote = this.docPropService.get(OverwriteNoteProperty);
    var height = range.getHeight();
    var width = range.getWidth();
    for (var x = 1; x <= width; ++x) {
      for (var y = 1; y <= height; ++y) {
        var cell = range.getCell(y, x);
        if (!overwriteNote && cell.getNote() != '') continue;

        var validation = cell.getDataValidation();
        if (this.hasRightValidationType(validation)) {
          this.updateNoteFromRange(cell, validation.getCriteriaValues()[0]);
        }
      }
    }
  }

  private hasRightValidationType(valid: any): boolean {
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
        // assumes corresponding note content is one cell to the right of actual
        cell.setNote(currentCell.offset(0, 1).getValue());
        return;
      }
    }
  }
}
