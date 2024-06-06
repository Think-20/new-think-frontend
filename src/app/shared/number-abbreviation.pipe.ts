import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'numberAbrev' })
export class NumberAbbreviationPipe implements PipeTransform {
  transform(value) {
    let suffix = ['', 'k', 'mi', 'bi']
    let suffixSelected = ''
    let string = String(parseInt(value))
    let newValue: string
    let index: number
    let pow: number

    for(let i = 1; i < suffix.length ; i++) {
      pow = Math.pow(10, i * 3)

      if(value > pow) {
        suffixSelected = suffix[i]
        index = i
      }
    }

    newValue = string.substring(0, string.length - (index * 3))

    if(newValue.length == 1) {
      let dig = string.substring(string.length - (index * 3), string.length - (index * 3) + 1)
      dig != '0' ? newValue += '.' + dig : ''
    }

    return newValue + suffixSelected
  }
}
