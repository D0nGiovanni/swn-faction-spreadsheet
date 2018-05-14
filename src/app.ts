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
  var response = ui.prompt(
    'Spreadsheet Import',
    'Please enter the sheet url or id of the source spreadsheet',
    ui.ButtonSet.OK_CANCEL
  );
  var sheetId = '';
  if (response.getSelectedButton() == ui.Button.OK) {
    let input = response.getResponseText();
    if (isAlphaNumeric(input)) {
      sheetId = input;
    } else {
      sheetId = getIdFromUrl(input);
    }
    if (sheetId == '') {
      spreadSheet.toast(
        'Oops, something went wrong. Please make sure you entered the url or id correctly.'
      );
      return;
    }
    try {
      let ss = SpreadsheetApp.openById(sheetId);
      importService.import(ss);
      spreadSheet.toast(
        'Yay! You managed to import all your data! Now go get your Nerps!'
      );
    } catch (error) {
      spreadSheet.toast(
        'Looks like your spreadsheet is lost to the scream. Bummer.'
      );
    }
  }
};

function getIdFromUrl(input: string): string {
  var rxarr = new RegExp('/spreadsheets/d/([a-zA-Z0-9-_]+)').exec(input);
  return rxarr != null ? rxarr[1] : '';
}

function isAlphaNumeric(str: string): boolean {
  return /^[A-Za-z0-9-_]+$/.test(str);
}
