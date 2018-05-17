import { NamedRangeService, RangeNames } from './named-range-service';

export class FactionCredsService {
  constructor(private namedRangeService: NamedRangeService) {}

  updateFacCreds(operation: (balance: number, income: number) => number): void {
    var incomes = this.namedRangeService.getRangeAsAny(
      RangeNames.FactionIncomes
    ) as number[][];
    var balances = this.namedRangeService.getRangeAsAny(
      RangeNames.FactionBalances
    ) as number[][];
    balances.forEach((balance, key) => {
      const income = incomes[key][0];
      if (typeof income != 'number') return;
      if (typeof balance[0] == 'number') {
        balance[0] = operation(balance[0], income);
      } else {
        balance[0] = income;
      }
    });
    this.namedRangeService.setRange(RangeNames.FactionBalances, balances);
  }
}
