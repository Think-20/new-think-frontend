import { Employee } from '../employees/employee.model'
import { Notifiable } from '../notification-bar/notification/notification.model';
import { Functionality } from '../functionalities/functionality.model';
import { Display } from '../displays/display.model';

export class User {
  id: number
  email: string
  password: string
  lastAccess: string
  employee?: Employee
  employee_id: number
  functionalities?: Functionality[]
  displays?: Display[]
  coordinatesNow ?: string
}
