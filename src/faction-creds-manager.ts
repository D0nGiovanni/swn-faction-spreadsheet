const incomeRangeName = 'FactionIncome';
const facCredsRangeName = 'FactionFacCreds';

export class FactionCredsManager {
  constructor(private spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet) {}

  updateFacCreds(operation: (l: number, r: number) => number): void {
    var ranges = this.spreadsheet.getNamedRanges();

    // google apps script does not know find - used filter instead
    // there should not ever be any two named ranges with the same name
    var incomeRange = ranges
      .filter(el => el.getName() == incomeRangeName)[0]
      .getRange();
    var facCredRange = ranges
      .filter(el => el.getName() == facCredsRangeName)[0]
      .getRange();
    var length = this.newMethod(incomeRange);

    for (let index = 1; index <= length; index++) {
      var income = incomeRange.getCell(index, 1).getValue();
      if (typeof income != 'number') continue;
      var target = facCredRange.getCell(index, 1);
      var facCred = target.getValue();
      if (typeof facCred == 'number') {
        target.setValue(operation(facCred, income));
      } else {
        target.setValue(income);
      }
    }
  }

  private newMethod(incomes: GoogleAppsScript.Spreadsheet.Range) {
    return incomes.getHeight();
  }
}
