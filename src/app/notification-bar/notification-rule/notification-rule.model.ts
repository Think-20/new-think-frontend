import { NotificationType } from "../notification-type/notification-type.model";
import { User } from "../../user/user.model";

export class NotificationRule {
  id : number
  type_id?: number
  type?: NotificationType
  user_id?: number
  user?: User
}
