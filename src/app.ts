import { SwnFactionHelperMenu } from './menu';
import {
  BooleanDocumentPropertyService,
  AutoNoteProperty,
  OverwriteNoteProperty
} from './boolean-document-property-service';
import { NoteWriter } from './note-writer';
import { FactionCredsManager } from './faction-creds-manager';

var docPropService = new BooleanDocumentPropertyService();
var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
var menu = new SwnFactionHelperMenu(spreadSheet, docPropService);

// all the global functions required by the spreadsheet are defined here

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
  var fcm = new FactionCredsManager(spreadSheet);
  fcm.updateFacCreds((l, r) => l + r);
};

global.subtractFacCreds = () => {
  var fcm = new FactionCredsManager(spreadSheet);
  fcm.updateFacCreds((l, r) => l - r);
};
