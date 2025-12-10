import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'speed',
  standalone: true
})
export class SpeedPipe implements PipeTransform {
  public transform(value: number | null | undefined, unit = 'km/h'): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '-';
    }

    return `${value.toFixed(1)} ${unit}`;
  }
}
