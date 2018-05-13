declare namespace globalFunctions {
  interface Global {
    onOpen(): void;
  }
}

declare var global: globalFunctions.Global;
