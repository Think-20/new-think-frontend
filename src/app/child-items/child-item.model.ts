import { Measure } from '../measures/measure.model';
import { Item } from '../items/item.model';

export class ChildItem {
    id: number
    quantity: number
    measure: Measure
    item: Item
}