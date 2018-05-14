import { SwnFactionHelperMenu } from './menu';
import {
  BooleanDocumentPropertyService,
  AutoNoteProperty,
  OverwriteNoteProperty
} from './boolean-document-property-service';
import { NoteWriter } from './note-writer';
import { FactionCredsManager } from './faction-creds-manager';
import { SpreadsheetImportService } from './spreadsheet-import-service';

var docPropService = new BooleanDocumentPropertyService();
var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
var menu = new SwnFactionHelperMenu(spreadSheet, docPropService);
var importService = new SpreadsheetImportService(spreadSheet);

global.onOpen = () => {
  docPropService.initIfNotExists(AutoNoteProperty);
  docPropService.initIfNotExists(OverwriteNoteProperty);
  menu.onOpen();
};

global.toggleAutoNote = () => {
  var value = docPropService.toggle(AutoNoteProperty);
  menu.update();
  spreadSheet.toast(
    value
      ? 'Notes will now automatically be added.'
      : 'Notes will not automatically be added anymore.'
  );
};

global.toggleOverwriteNote = () => {
  var value = docPropService.toggle(OverwriteNoteProperty);
  menu.update();
  spreadSheet.toast(
    value
      ? 'Existing notes will now be overwritten.'
      : 'Existing notes will not be overwritten anymore.'
  );
};

global.onEdit = event => {
  var noteWriter = new NoteWriter(docPropService);
  noteWriter.updateNotes(event.range);
};

global.updateNotes = () => {
  var noteWriter = new NoteWriter(docPropService);
  noteWriter.updateNotes(spreadSheet.getActiveSheet().getActiveRange(), true);
};

global.addFacCreds = () => {
  var fcm = new FactionCredsManager(
    spreadSheet.getSheetByName('FactionTracker')
  );
  fcm.updateFacCreds((l, r) => l + r);
};

global.detractFacCreds = () => {
  var fcm = new FactionCredsManager(
    spreadSheet.getSheetByName('FactionTracker')
  );
  fcm.updateFacCreds((l, r) => l - r);
};

global.importSpreadsheet = () => {
  var ui = SpreadsheetApp.getUi();
  spreadSheet.toast('Start!');

  var response = ui.prompt(
    'Spreadsheet Import',
    'Please enter the sheet id of the other spreadsheet',
    ui.ButtonSet.OK_CANCEL
  );
  spreadSheet.toast('Promt end!');

  if (response.getSelectedButton() == ui.Button.OK) {
    spreadSheet.toast('OK!');
    let sheetId = response.getResponseText();
    if (!isAlphaNumeric(sheetId)) {
      ui.alert('The id should only constist of alphanumeric signs');
      return;
    }
    // importService.import(SpreadsheetApp.openById(sheetId));
  }
  spreadSheet.toast('The End!');
};

function isAlphaNumeric(str: string): boolean {
  return /[A-Za-z0-9]+/.test(str);
}
