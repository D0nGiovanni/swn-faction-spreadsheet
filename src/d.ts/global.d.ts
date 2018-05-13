declare namespace globalFunctions {
  interface Global {
    onOpen(): void;
    toggleAutoNote(): void;
    toggleOverwriteNote(): void;
  }
}

declare var global: globalFunctions.Global;
