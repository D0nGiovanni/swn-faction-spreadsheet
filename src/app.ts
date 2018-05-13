import { SwnFactionHelperMenu } from './menu';

declare namespace globalFunctions {
  interface Global {
    onOpen(): void;
  }
}

declare var global: globalFunctions.Global;

var menu = new SwnFactionHelperMenu();

global.onOpen = function() {
  menu.onOpen();
};
