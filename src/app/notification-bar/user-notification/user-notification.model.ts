import { Notification } from "../notification/notification.model";
import { User } from "../../user/user.model";

export class UserNotification {
  id: number
  notification_id?: number
  notification?: Notification
  user_id?: number
  user?: User
  special: number
  special_message: string
  received: number
  received_date: string
  read: number
  read_date: string
}
