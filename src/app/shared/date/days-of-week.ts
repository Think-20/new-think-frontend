export const DAYSOFWEEK: DayOfWeek[] = [
    {id: 0, name: 'Domingo', abbrev: 'dom'},
    {id: 1, name: 'Segunda-Feira', abbrev: 'seg'},
    {id: 2, name: 'Terça-Feira', abbrev: 'ter'},
    {id: 3, name: 'Quarta-feira', abbrev: 'qua'},
    {id: 4, name: 'Quinta-feira', abbrev: 'qui'},
    {id: 5, name: 'Sexta-feira', abbrev: 'sex'},
    {id: 6, name: 'Sábado', abbrev: 'sab'},
  ];
  
  export class DayOfWeek {
    id: number
    name: string
    abbrev: string
  }