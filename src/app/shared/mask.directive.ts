import { Directive, HostListener, Input, OnInit, forwardRef, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Directive({
    selector: '[mask]',
    providers: [{
        provide: NG_VALUE_ACCESSOR, 
        useExisting: forwardRef(() => MaskDirective),
        multi: true 
    }]
})
export class MaskDirective implements ControlValueAccessor {

  @Input('mask') mask: string
  onTouched: any
  onChange: any

  constructor(
    private elementRef: ElementRef
  ) { }

  writeValue(value: any): void {
    const input = this.elementRef.nativeElement as HTMLInputElement
    input.value = value
  }

  registerOnChange(fn: any): void {
      this.onChange = fn
  }

  registerOnTouched(fn: any): void {
      this.onTouched = fn
  }
    
  @HostListener('keyup', ['$event']) 
  onKeyup($event: any) {
    var valor = $event.target.value.replace(/\D/g, '');
    var pad = this.mask.replace(/\D/g, '').replace(/9/g, '_');
    var valorMask = valor + pad.substring(0, pad.length - valor.length);
 
    // retorna caso pressionado backspace
    if ($event.keyCode === 8) {
      this.onChange(valor);
      return;
    }
 
    if (valor.length <= pad.length) {
      this.onChange(valor);
    }
 
    var valorMaskPos = 0;
    valor = '';
    for (var i = 0; i < this.mask.length; i++) {
      if(this.mask.charAt(i) === '?') { }
      else if (isNaN(parseInt(this.mask.charAt(i)))) {
        valor += this.mask.charAt(i);
      } else {
        valor += valorMask[valorMaskPos++];
      }
    }
    
    if (valor.indexOf('_') > -1) {
      valor = valor.substr(0, valor.indexOf('_'));
    }
 
    $event.target.value = valor
    this.onChange(valor)
  }
 
  @HostListener('blur', ['$event']) 
  onBlur($event: any) {
    let charNumbers = this.mask.indexOf('?') > -1 
      ? [(this.mask.length - 1), (this.mask.length - 2)] 
      : [this.mask.length]

    let value: number

    charNumbers.forEach(val => {
      if(val === $event.target.value.length)
        value = val
    })

    if(value !== undefined) {
      return
    }
    
    this.onChange('');
    this.onTouched('');
    $event.target.value = '';
  }

}