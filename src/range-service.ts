export class RangeService {
  static fitValuesToSize(values: string[][], height: number, width: number) {
    while (values.length < height) values.push(['']);
    while (values.length > height) values.pop();
    values.forEach(row => {
      while (row.length < width) row.push('');
      while (row.length > width) row.pop();
    });
  }
}
