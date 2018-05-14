export class FactionCredsManager {
  constructor(private sheet: GoogleAppsScript.Spreadsheet.Sheet) {}

  updateFacCreds(operation: (l, r) => number): void {
    var incomes = this.sheet.getRange('K2:K33'); // ranges might change
    var facCreds = this.sheet.getRange('M2:M33');
    var length = incomes.getHeight();

    for (let index = 1; index <= length; index++) {
      var income = incomes.getCell(index, 1).getValue();
      if (typeof income != 'number') continue;
      var target = facCreds.getCell(index, 1);
      var facCred = target.getValue();
      if (typeof facCred == 'number') {
        target.setValue(operation(facCred, income));
      } else {
        target.setValue(income);
      }
    }
  }
}
