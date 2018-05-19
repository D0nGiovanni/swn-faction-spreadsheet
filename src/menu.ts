import {
  AutoNoteProperty,
  BooleanDocumentPropertyService,
  OverwriteNoteProperty
} from './services/boolean-document-property-service';

const MenuName = 'SWN Faction Helper';

export class Menu {
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

  public onOpen() {
    this.spreadSheet.addMenu(MenuName, this.menuItems());
  }

  public update() {
    this.spreadSheet.updateMenu(MenuName, this.menuItems());
  }
}
