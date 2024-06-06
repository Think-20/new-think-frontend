import { AbstractControl } from "@angular/forms";
import { Client } from "../clients/client.model";

export function ObjectValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const value = control.value

  if((value.id == undefined && value != '')) {
    return { 'validClient' : true }
  }

  return null
}

export function CnpjValidator(control: AbstractControl): { [key: string]: boolean } | null {
  function calcDigit(cnpj: string, position: number): string {
    let digits = cnpj.substr(0, 12 + (position - 5))
    let total = 0
    let mod = 0

    for(let i = 0; i < digits.length; i++) {
      total += parseInt(digits[i]) * position
      position--

      if(position < 2) position = 9
    }

    mod = Math.round(total % 11)
    return mod < 2 ? '0' : (11 - mod).toString()
  }


  const value = String(control.value).replace(/[^0-9]/g, '')

  if(value.length < 14) {
    return { 'validCnpj' : true }
  }

  if(calcDigit(value, 5) != value[12] || calcDigit(value, 6) != value[13]) {
    return { 'validCnpj' : true }
  }

  return null
}
