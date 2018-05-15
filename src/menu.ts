import {
  BooleanDocumentPropertyService,
  AutoNoteProperty,
  OverwriteNoteProperty
} from './boolean-document-property-service';

const menuName = 'SWN Faction Helper';

export class SwnFactionHelperMenu {
  private autoEnabled: boolean = true;
  private safeEnabled: boolean = true;
  private menuItems = () => {
    return [
      { name: 'Pay out faction incomes', functionName: 'addFacCreds' },
      { name: 'Subtract faction incomes', functionName: 'subtractFacCreds' },
      { name: 'Update notes for selection', functionName: 'updateNotes' },
      {
        name: this.docPropService.get(AutoNoteProperty)
          ? "Don't add notes automatically"
          : 'Add notes automatically',
        functionName: 'toggleAutoNote'
      },
      {
        name: this.docPropService.get(OverwriteNoteProperty)
          ? 'Only update empty notes'
          : 'Update even if note is not blank',
        functionName: 'toggleOverwriteNote'
      },
      { name: 'Import sector map', functionName: 'importSectorMap' }
    ];
  };

  constructor(
    private spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet,
    private docPropService: BooleanDocumentPropertyService
  ) {}

  onOpen() {
    this.spreadSheet.addMenu(menuName, this.menuItems());
  }

  update() {
    this.spreadSheet.updateMenu(menuName, this.menuItems());
  }
}
