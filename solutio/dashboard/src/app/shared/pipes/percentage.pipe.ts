import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentage',
  standalone: false
})
export class PercentagePipe implements PipeTransform {
  public transform(value: number | null | undefined, decimals = 0): string {
    if (value === null || value === undefined) {
      return '-';
    }

    const formattedValue = decimals > 0 
      ? Number(value).toFixed(decimals)
      : Math.round(value).toString();

    return `${formattedValue}%`;
  }
}

