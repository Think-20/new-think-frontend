import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'decimal' })
export class DecimalPipe implements PipeTransform {
  transform(value: number | string, decimalSeparator: string = ','): string {
    if (value == null || value === '') return '';

    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '';

    const formattedNumber = num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: false,
    });

    return formattedNumber.replace('.', decimalSeparator);
  }
}