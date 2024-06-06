import { Item } from "../items/item.model";

export class ItemCategory {
    id: number
    description: string
    item_category?: ItemCategory
    item_categories?: ItemCategory[]
    items?: Item[]
}
