import { Directive, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: "[ucWords]"
})
export class UcWordsDirective {
    constructor(private el: ElementRef, private control: NgControl) { }

    @HostListener('keyup', ['$event'])
    changeLetter($event: Event) {
        let value = this.control.control.value.toLowerCase().replace(/\s[a-z]/g, function(letter) {
            return letter.toUpperCase();
        });
        this.control.control.setValue((value.slice(0, 1).toUpperCase() + value.slice(1, value.length)))
    }
}