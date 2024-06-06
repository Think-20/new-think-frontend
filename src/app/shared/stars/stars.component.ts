import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'cb-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.css']
})
export class StarsComponent implements OnInit {

  @Input('label') label: string = ''
  @Input('readonly') readonly: boolean = false
  rates: number[] = [1,2,3,4,5]
  @Input('rate') rate: number = 0
  @Input('input') input: FormControl = new FormControl()
  @Input('hasLabel') hasLabel: boolean = true;
  temp: number = 0

  constructor() { }

  ngOnInit() {
    if(this.rate != null) {
      this.input.setValue(this.rate.toString())
    }

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
  }

  mouseLeave(): void {
    if(this.readonly || this.input.disabled) return
    this.rate = this.temp
  }

  defineRate(index: number) {
    if(this.readonly || this.input.disabled) return
    /* Zerar valor do rate, caso a estrela clicada já tenha valor */
    if(this.temp === index) {
      this.changeRate(0)
      this.temp = 0
    } else {
      this.changeRate(index)
      this.temp = index
    }
  }

}
