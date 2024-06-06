import { Notifiable } from "../notification-bar/notification/notification.model";
import { Employee } from "../employees/employee.model";

export class Agent implements Notifiable {
  id: number
  name: string
  description: string
  image: string

  getName(): string {
    return this.name
  }

  getEmployee(): Employee {
    return null
  }

  hasEmployee(): boolean {
    return false
  }
}
