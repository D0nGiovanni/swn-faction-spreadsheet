import { SwnFactionHelperMenu } from './menu';
import {
  BooleanDocumentPropertyService,
  AutoNoteProperty,
  OverwriteNoteProperty
} from './boolean-document-property-service';
import { NoteWriter } from './note-writer';
import { FactionCredsManager } from './faction-creds-manager';
import { SectorMapService } from './sector-map-service';
import { NamedRangeService, RangeNames } from './named-range-service';
import { NoteLookup } from './note-lookup';

var docPropService = new BooleanDocumentPropertyService();
var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
var sectorMapService = new SectorMapService(spreadSheet);
var menu = new SwnFactionHelperMenu(spreadSheet, docPropService);
var namedRangeService = new NamedRangeService(spreadSheet);
var noteLookup = new NoteLookup(namedRangeService);
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
  var noteWriter = new NoteWriter(
    docPropService,
    namedRangeService,
    noteLookup
  );
  noteWriter.updateNotes(event.range);
};

global.updateNotes = () => {
  var noteWriter = new NoteWriter(
    docPropService,
    namedRangeService,
    noteLookup
  );
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

global.importSectorMap = () => {
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt(
    'Import SectorsWithoutNumber Map',
    'Please enter the name of the json-file in your Google Drive',
    ui.ButtonSet.OK_CANCEL
  );
  if (response.getSelectedButton() == ui.Button.OK) {
    let input = response.getResponseText();
    if (!/.json$/i.test(input)) {
      spreadSheet.toast('Invalid file-format. The file should end in .json');
      return;
    }
    try {
      sectorMapService.import(input);
      spreadSheet.toast("Yay! Here's your map! Now go get your Nerps on!");
    } catch (error) {
      spreadSheet.toast('Looks like your file is lost to the scream. Bummer.');
    }
  }
};
