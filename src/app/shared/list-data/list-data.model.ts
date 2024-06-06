import { Type } from "@angular/core";
import { DataInfo } from "../data-info.model";
import { Observable } from "rxjs";

export class ListData {
  header: HeaderData
  body: BodyData
  footer?: FooterData
}

export class FilterField {
  class: string
  placeholder: string
  formcontrolname: string
  arrayValues?: Promise<Array<any>>
  type: string
  multiple?: boolean = false
  optionValue?: string
  optionDescription?: string
  starsRate?: number

  compareWith? = function(var1: Identifiable, var2: Identifiable) {
    return var1.id === var2.id
  }

  showOptionValue? = function(obj) {
    if(this.optionValue != undefined)
      return obj[this.optionValue]

    return obj
  }

  showOptionDescription? = function (obj) {
    if(this.optionDescription != undefined)
      return obj[this.optionDescription]
  }

  constructor(params: FilterField) {
    this.class = params.class
    this.placeholder = params.placeholder
    this.multiple = params.multiple
    this.formcontrolname = params.formcontrolname
    this.type = params.type
    this.arrayValues = params.arrayValues
    this.optionDescription = params.optionDescription
    this.optionValue = params.optionValue
    this.starsRate = params.starsRate
  }
}

/*
  Função para instanciar o objeto e permitindo assim fazer uso das funções
  pré-determinadas na classe.
*/
export function mF(params: FilterField) {
  return new FilterField(params)
}

export class DataField {
  style: {[key:string]: string}
  component?: Type<any>
  label: string

  showData? = function (obj) {
    this.hasData = true;

    if(this.optionDescription != undefined)
      return obj[this.optionDescription]
  }

  afterCreateComponent? = function (obj, dataInfo: DataInfo, instance) {
    return null
  };
}

export class HeaderData {
  filterFields: FilterField[];
  getParams: (formValue) => {[key: string]: string};
}

export class BodyData {
  customRowStyle?: (list: any) => {[key: string]: any} = () => { return {} };
  dataFields: DataField[];
  hasMenuButton?: boolean = false
  buttonStyle?: {[key: string]: string} = { width: '5%' };
  menuData?: {[key: string]: string} = {};
  menuItems: ListDataMenuItem[]
  loadData: (params, page: number) => Observable<DataInfo>;
}

export class FooterData {
  dataFields: DataField[];
}

export class ListDataMenuItem {
  icon: string;
  label: string;
  removeWhenClickTrue?: boolean = false;
  actions: {
    disabled: (obj) => boolean,
    click: (obj, objList: Array<any>) => Promise<boolean>,
  };
}

export interface Identifiable {
  id: number
}
