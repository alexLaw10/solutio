import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'speed',
  standalone: false
})
export class SpeedPipe implements PipeTransform {
  public transform(value: number | null | undefined, unit = 'km/h', decimals = 0): string {
    if (value === null || value === undefined) {
      return '-';
    }

    const formattedValue = decimals > 0 
      ? Number(value).toFixed(decimals)
      : Math.round(value).toString();

    return `${formattedValue} ${unit}`;
  }
}

