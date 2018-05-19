import { NamedRangeService, RangeNames } from './services/named-range-service';

export class FactionBalanceWriter {
  constructor(private namedRangeService: NamedRangeService) {}

  public updateFacCreds(
    operation: (balance: number, income: number) => number
  ): void {
    const incomes = this.namedRangeService.getRangeAs<number>(
      RangeNames.FactionIncomes
    );
    const balances = this.namedRangeService.getRangeAs<number>(
      RangeNames.FactionBalances
    );
    balances.forEach((balance, key) => {
      const income = incomes[key][0];
      if (typeof income !== 'number') {
        return;
      }
      if (typeof balance[0] === 'number') {
        balance[0] = operation(balance[0], income);
      } else {
        balance[0] = income;
      }
    });
    this.namedRangeService.setRange(RangeNames.FactionBalances, balances);
  }
}
