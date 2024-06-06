import { NotificationGenre } from "../notification-genre/notification-genre.mode";

export class NotificationType {
  id : number
  description : string
  genre_id?: number
  genre?: NotificationGenre
  active: number
}
