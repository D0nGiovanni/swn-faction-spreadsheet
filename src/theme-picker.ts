import { Dimensions } from './models/dimensions';
import { NamedRangeService, RangeNames } from './services/named-range-service';

export class ThemePicker {
  constructor(
    private spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet,
    private namedRangeService: NamedRangeService
  ) {}

  private getTheme(selected: string): Theme {
    const themes = this.namedRangeService.getRange(RangeNames.LookupThemes);
    let theme;
    themes.forEach(data => {
      const name = data.shift();
      SpreadsheetApp.getActiveSpreadsheet().toast(data[5]);
      if (name === selected) {
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
      }
    });
    return theme;
  }

  public apply(name: string) {
    const theme = this.getTheme(name);
    this.themeSheet(SheetNames.FactionTracker, theme, [
      RangeNames.FactionAssets,
      RangeNames.FactionMaxHPToUpkeep
    ]);
    this.themeSheet(SheetNames.AssetTracker, theme, [
      RangeNames.AssetTypes,
      RangeNames.AssetMaxHPToUpkeep
    ]);
    this.themeSheet(SheetNames.FactionTurns, theme, [
      RangeNames.FactionTurnsFactions
    ]);
    this.themeSheet(SheetNames.SectorMap, theme, [
      RangeNames.SystemCoordsRepresentation
    ]);
  }

  private themeSheet(
    sheetName: SheetNames,
    theme: Theme,
    protRanges: RangeNames[]
  ) {
    const sheet = this.spreadsheet.getSheetByName(sheetName);
    const dims: Dimensions[] = [];
    protRanges.forEach(r => {
      dims.push(this.namedRangeService.getDimensions(r));
    });
    const range = sheet.getRange('A:Z'); // get whole sheet
    this.setBgColors(range, dims, theme);
    this.setFontColors(range, dims, theme);
    this.setBorderColor(sheetName, sheet, theme);
    this.setConditionalRuleColors(sheetName, sheet, theme);
  }

  private setBgColors(
    range: GoogleAppsScript.Spreadsheet.Range,
    dims: Dimensions[],
    theme: Theme
  ) {
    const bgColors = range.getBackgrounds();
    this.setColors(
      bgColors,
      dims,
      theme.headBgColor,
      theme.bodyBgColor,
      theme.protectedBgColor
    );
    range.setBackgrounds(bgColors);
  }

  private setFontColors(
    range: GoogleAppsScript.Spreadsheet.Range,
    dims: Dimensions[],
    theme: Theme
  ) {
    const fontColors = range.getFontColors();
    this.setColors(
      fontColors,
      dims,
      theme.headFontColor,
      theme.bodyFontColor,
      theme.protectedFontColor
    );
    range.setFontColors(fontColors);
  }

  private setBorderColor(
    sheetName: SheetNames,
    sheet: GoogleAppsScript.Spreadsheet.Sheet,
    theme: Theme
  ) {
    if (sheetName === SheetNames.FactionTracker) {
      sheet
        .getRange('D2:I')
        .setBorder(null, null, null, null, null, null, theme.borderColor, null);
    }
  }

  private setConditionalRuleColors(
    sheetName: SheetNames,
    sheet: GoogleAppsScript.Spreadsheet.Sheet,
    theme: Theme
  ) {
    if (sheetName === SheetNames.AssetTracker) {
      const rule = SpreadsheetApp.newConditionalFormatRule()
        .withCriteria(SpreadsheetApp.BooleanCriteria.CUSTOM_FORMULA, [
          '= $D2 = TRUE'
        ])
        .setRanges([sheet.getRange('A2:Z')])
        .setBold(true)
        .setFontColor(theme.highlightFontColor)
        .setBackground(theme.highlightBgColor)
        .build();
      sheet.setConditionalFormatRules([rule]);
    }
  }

  private setColors(
    values: string[][],
    dims: Dimensions[],
    headColor: string,
    bodyColor: string,
    protColor: string
  ) {
    this.setHeadColor(values, headColor);
    let last = 0;
    dims.forEach(dim => {
      this.setBodyColor(values, bodyColor, last, dim.column);
      this.setBodyColor(
        values,
        protColor,
        dim.column,
        (last = dim.column + dim.width)
      );
    });
    this.setBodyColor(values, bodyColor, last, values[0].length);
  }

  private setHeadColor(values: string[][], headColor: string) {
    for (let i = 0; i < values[0].length; i++) {
      values[0][i] = headColor;
    }
  }

  private setBodyColor(
    values: string[][],
    color: string,
    begin: number,
    end: number
  ) {
    const secondRow = 1;
    for (let rowId = secondRow; rowId < values.length; rowId++) {
      const row = values[rowId];
      this.SetRowColor(row, color, begin, end);
    }
  }

  private SetRowColor(
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

enum SheetNames {
  FactionTracker = 'FactionTracker',
  AssetTracker = 'AssetTracker',
  FactionTurns = 'FactionTurns',
  SectorMap = 'SectorMap'
}
