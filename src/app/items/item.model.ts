import { ItemCategory } from '../item-categories/item-category.model';
import { CostCategory } from '../cost-categories/cost-category.model';
import { Measure } from '../measures/measure.model';
import { Pricing } from '../pricings/pricing.model';   
import { ChildItem } from '../child-items/child-item.model';
import { ItemType } from '../item-types/item-type.model';

export class Item {
    id: number
    name: string
    description: string
    image: string
    item_category: ItemCategory
    cost_category: CostCategory
    item_type: ItemType
    pricings: Pricing[] = []
    child_items: ChildItem[] = []
}