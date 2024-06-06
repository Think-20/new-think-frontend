import { StandItemType } from "app/stand/stand-items/stand-item-form/stand-item-types/stand-item-type.model";

export class StandItem {
  id: number
  title: string
  quantity: number
  description: string
  type?: StandItemType
  stand_item_type_id: number
  state?: string
}
