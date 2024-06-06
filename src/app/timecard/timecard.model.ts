import { Employee } from "../employees/employee.model";
import { User } from "../user/user.model";
import { TimecardPlace } from "./timecard-place/timecard-place.model";

export class Timecard {
  id: number
  entry: string
  exit: string
  employee_id?: number
  employee?: Employee
  approved?: number
  approved_user?: User
  balance?: string
  entryPlace?: string
  entry_place_id?: number
  exit_place_id?: number
  entry_place?: TimecardPlace
  exit_place?: TimecardPlace
  autoEntryPlaceCoordinates?: string
  autoEntryPlace?: string
  exitPlace?: string
  autoExitPlaceCoordinates?: string
  autoExitPlace?: string
}
