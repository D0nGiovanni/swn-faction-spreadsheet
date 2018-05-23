import { Map } from 'core-js/library';
import { NamedRangeService, RangeNames } from './services/named-range-service';

export class ThemePicker {
  private themes = new Map<string, Theme>();

  constructor(
    private spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet,
    private namedRangeService: NamedRangeService
  ) {}

  public onOpen() {
    this.getThemes();
  }

  private getThemes(): Theme {
    const themes = this.namedRangeService.getRange(RangeNames.LookupThemes);
    let theme;
    themes.forEach(data => {
      const name = data.shift();
      SpreadsheetApp.getActiveSpreadsheet().toast(data[5]);
      if (name) {
        theme = new Theme(
          data[0],
          data[1],
          data[2],
          data[3],
          data[4],
          data[5],
          data[6],
          data[7],
          data[8]
        );
        this.themes.set(name, theme);
      }
    });
    return theme;
  }

  public apply(name: string) {
    let bla = this.themes.keys[0];
    bla = name;
    bla = bla;
    const theme = this.getThemes();
    const sheet = this.spreadsheet.getSheetByName('FactionTracker');

    const range = sheet.getRange('A:Z');
    const bgColors = range.getBackgrounds(); // get whole sheet
    const assets = RangeNames.FactionAssets;
    const assetDimensions = this.namedRangeService.getDimensions(assets);
    const hpToUpkeep = RangeNames.FactionMaxHPToUpkeep;
    const hpDimensions = this.namedRangeService.getDimensions(hpToUpkeep);

    // apply backgrounds
    this.applyColorToHead(bgColors, theme);
    let last = 0;
    const dims = [assetDimensions, hpDimensions];
    dims.forEach(dim => {
      this.applyColorToBody(bgColors, theme.bodyBgColor, last, dim.column);
      this.applyColorToBody(
        bgColors,
        theme.protectedBgColor,
        dim.column,
        (last = dim.column + dim.width)
      );
    });
    this.applyColorToBody(
      bgColors,
      theme.bodyBgColor,
      last,
      bgColors[0].length
    );
    range.setBackgrounds(bgColors);

    // apply fonts
    // apply borders
    // apply conditionalrules
  }

  private applyColorToHead(bgColors: string[][], theme: Theme) {
    for (let i = 0; i < bgColors[0].length; i++) {
      bgColors[0][i] = theme.headBgColor;
    }
  }

  private applyColorToBody(
    bgColors: string[][],
    color: string,
    begin: number,
    end: number
  ) {
    const secondRow = 1;
    for (let rowId = secondRow; rowId < bgColors.length; rowId++) {
      const row = bgColors[rowId];
      this.applyColorToRow(row, color, begin, end);
    }
  }

  private applyColorToRow(
    row: string[],
    color: string,
    begin: number,
    end: number
  ) {
    for (let col = begin; col < end; col++) {
      row[col] = color;
    }
  }
}

// tslint:disable-next-line:max-classes-per-file
class Theme {
  constructor(
    public headFontColor: string,
    public headBgColor: string,
    public bodyFontColor: string,
    public bodyBgColor: string,
    public protectedFontColor: string,
    public protectedBgColor: string,
    public highlightFontColor: string,
    public highlightBgColor: string,
    public borderColor: string
  ) {}
}
