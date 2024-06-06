import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appFormatMask]'
})
export class FormatMaskDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const value = event.target.value;
    const numericValue = value.replace(/\D/g, '');
    const formattedValue = this.formatNumber(numericValue);
    this.el.nativeElement.value = formattedValue;
  }

  formatNumber(value: string): string {
    const intValue = parseInt(value, 10);
    if (!isNaN(intValue)) {
      const formattedValue = (intValue / 100).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return formattedValue;
    }
    return '';
  }
}