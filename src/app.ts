import { AboutPage } from './about-page';
import { FactionBalanceWriter } from './faction-balance-writer';
import { Menu } from './menu';
import { NoteWriter } from './note-writer';
import { SectorMapImporter } from './sector-map-importer';
import {
  AutoNoteProperty,
  BooleanDocumentPropertyService,
  OverwriteNoteProperty
} from './services/boolean-document-property-service';
import { NamedRangeService } from './services/named-range-service';
import { NoteLookupService } from './services/note-lookup-service';

const docPropService = new BooleanDocumentPropertyService();
const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
const menu = new Menu(spreadSheet, docPropService);
const namedRangeService = new NamedRangeService(spreadSheet);
const sectorMapService = new SectorMapImporter(namedRangeService);
const noteLookup = new NoteLookupService(namedRangeService);
const fcm = new FactionBalanceWriter(namedRangeService);
// all the global functions required by the spreadsheet are defined here

global.onOpen = event => {
  const noAuth = event && event.authMode === ScriptApp.AuthMode.NONE;
  if (!noAuth) {
    docPropService.initIfNotExists(AutoNoteProperty);
    docPropService.initIfNotExists(OverwriteNoteProperty);
  }
  menu.onOpen(noAuth);
};

global.toggleAutoNote = () => {
  const value = docPropService.toggle(AutoNoteProperty);
  menu.update();
  spreadSheet.toast(
    value
      ? 'Notes will now automatically be added.'
      : 'Notes will not automatically be added anymore.'
  );
};

global.toggleOverwriteNote = () => {
  const value = docPropService.toggle(OverwriteNoteProperty);
  menu.update();
  spreadSheet.toast(
    value
      ? 'Existing notes will now be overwritten.'
      : 'Existing notes will not be overwritten anymore.'
  );
};

global.onEdit = event => {
  const noteWriter = new NoteWriter(
    docPropService,
    namedRangeService,
    noteLookup
  );
  noteWriter.updateNotes(event.range);
};

global.updateNotes = () => {
  const noteWriter = new NoteWriter(
    docPropService,
    namedRangeService,
    noteLookup
  );
  noteWriter.updateNotes(spreadSheet.getActiveSheet().getActiveRange(), true);
};

global.addFacCreds = () => {
  fcm.updateFacCreds((l, r) => l + r);
};

global.subtractFacCreds = () => {
  fcm.updateFacCreds((l, r) => l - r);
};

global.importSectorMap = () => {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    'Import SectorsWithoutNumber Map',
    'Please enter the name of the json-file in your Google Drive',
    ui.ButtonSet.OK_CANCEL
  );
  if (response.getSelectedButton() === ui.Button.OK) {
    const input = response.getResponseText();
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

global.showAbout = () => {
  AboutPage.showDialog();
};
