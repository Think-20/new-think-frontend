import { NotificationType } from "../notification-type/notification-type.model";
import { Employee } from "../../employees/employee.model";

export class Notification {
  id: number
  type_id?: number
  type?: NotificationType
  notifier_id?: number
  notifier_type?: string
  notifier?: Notifiable
  info?: string
  date: string
  message: string
}

export interface Notifiable {
  id: number
  name: string
  image: string
}
