import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentage',
  standalone: true
})
export class PercentagePipe implements PipeTransform {
  public transform(value: number | null | undefined, decimals: number = 0): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '-';
    }

    return `${value.toFixed(decimals)}%`;
  }
}
