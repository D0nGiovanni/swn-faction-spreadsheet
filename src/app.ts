import { SwnFactionHelperMenu } from './menu';
import {
  BooleanDocumentPropertyService,
  AutoNoteProperty,
  OverwriteNoteProperty
} from './boolean-document-property';

var docPropService = new BooleanDocumentPropertyService();
var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
var menu = new SwnFactionHelperMenu(spreadSheet, docPropService);

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
      ? 'Asset notes will now automatically be added.'
      : 'Asset notes will not automatically be added anymore.'
  );
};

global.toggleOverwriteNote = () => {
  var value = docPropService.toggle(OverwriteNoteProperty);
  menu.update();
  spreadSheet.toast(
    value
      ? 'Existing asset notes will now be overwritten.'
      : 'Existing asset notes will not be overwritten anymore.'
  );
};
