import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'cb-production-time',
  templateUrl: './production-time.component.html',
  styleUrls: ['./production-time.component.css']
})
export class ProductionTimeComponent implements OnInit {

  @Input('errorMessage') errorMessage: string
  @Input('label') label: string = ''
  @Input('readonly') readonly: boolean = false
  rates: number[] = []
  @Input('max') max: number
  @Input('min') min: number
  @Input('rate') rate: number = 0
  @Input('input') input: FormControl = new FormControl()
  temp: number

  constructor() {}

  ngOnInit() {
    for(var i = 1; i <= this.max; i += 1) {
      this.rates.push(i);
    }
    this.input.setValue(this.rate.toString())
    this.input.valueChanges.subscribe(value => {
      this.rate = value
    })

    /*
    this.input.statusChanges.subscribe((value) => {
      if(value == 'DISABLED') {
        this.rate = 0
      }
    })

    this.input.valueChanges.subscribe((value) => {
      if(value != 'DISABLED') {
        this.rate = value
      }
    })
    */
  }

  changeRate(newValue: number) {
    if(this.readonly || this.input.disabled) return

    this.rate = newValue

    if(newValue === 0) {
      this.input.setValue('')
    } else {
      this.input.setValue(this.rate.toString())
    }
  }

  mouseEnter(index: number): void {
    if(this.readonly || this.input.disabled) return
    this.temp = this.rate
    this.rate = index
    //this.changeRate(index)
  }

  mouseLeave(): void {
    if(this.readonly || this.input.disabled) return
    if(this.temp !== null && this.rate != 0)
    //this.changeRate(this.temp)
    this.rate = this.temp
  }

  defineRate(index: number) {
    if(this.readonly || this.input.disabled) return
    /* Zerar valor do rate, caso a estrela clicada já tenha valor */
    if(this.temp === index) {
      this.changeRate(0)
    } else {
      this.changeRate(index)
      this.temp = null
    }
  }

}
