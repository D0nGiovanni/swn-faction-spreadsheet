declare namespace globalFunctions {
  interface Global {
    onOpen(): void;
    toggleAutoNote(): void;
    toggleOverwriteNote(): void;
    onEdit(event): void;
    updateNotes(): void;
    addFacCreds(): void;
    subtractFacCreds(): void;
  }
}

declare var global: globalFunctions.Global;
