import { Provider } from '../providers/provider.model';
import { Measure } from '../measures/measure.model';
import { Item } from '../items/item.model';

export class Pricing {
    id: number
    price: number
    provider: Provider
    measure: Measure
    item: Item
}