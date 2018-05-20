// tslint:disable:no-namespace interface-name
declare namespace GoogleSheets {
  interface Event {
    authMode: GoogleAppsScript.Script.AuthMode;
  }

  interface OpenEvent extends Event {
    source: GoogleAppsScript.Spreadsheet.Spreadsheet;
  }

  interface EditEvent extends Event {
    oldValue;
    range: GoogleAppsScript.Spreadsheet.Range;
    value;
  }
}
