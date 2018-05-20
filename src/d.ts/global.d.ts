// tslint:disable:no-namespace
declare namespace globalFunctions {
  interface IGlobal {
    onOpen(event: GoogleSheets.OpenEvent): void;
    toggleAutoNote(): void;
    toggleOverwriteNote(): void;
    onEdit(event: GoogleSheets.EditEvent): void;
    updateNotes(): void;
    addFacCreds(): void;
    subtractFacCreds(): void;
    importSectorMap(): void;
  }
}

declare const global: globalFunctions.IGlobal;

/**
 * declare is used instead of export so that the transpiler does not
 * include this file in the transpilation process.
 * this would be a problem for Google Apps Script.
 */
