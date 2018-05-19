import { NamedRangeService, RangeNames } from './services/named-range-service';

export class FactionBalanceWriter {
  constructor(private namedRangeService: NamedRangeService) {}

  public updateFacCreds(
    operation: (balance: number, income: number) => number
  ): void {
    const incomes = this.namedRangeService.getRangeAsAny(
      RangeNames.FactionIncomes
    ) as number[][];
    const balances = this.namedRangeService.getRangeAsAny(
      RangeNames.FactionBalances
    ) as number[][];
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
