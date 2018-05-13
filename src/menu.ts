export class SwnFactionHelperMenu {
  private autoEnabled: boolean = true;
  private safeEnabled: boolean = true;
  private menuItems = [
    { name: 'Update Notes', functionName: 'updateNotes' },
    {
      name: (this.autoEnabled ? 'Disable' : 'Enable') + ' Autonote',
      functionName: 'toggleAutonote'
    },
    {
      name: this.safeEnabled
        ? 'Update even if note is not blank'
        : 'Only update empty notes',
      functionName: 'toggleSafe'
    }
  ];

  constructor() {}

  onOpen() {
    // If safeEnabled is not initialized, set it to true.
    var docProps = PropertiesService.getDocumentProperties();
    if (docProps.getProperty('safeEnabled') == null)
      docProps.setProperty('safeEnabled', 'true');

    // Add menu
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    spreadsheet.addMenu('SWN Faction Helper', this.menuItems);
  }
}
