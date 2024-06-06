import { DayOfWeek } from '../shared/date/days-of-week';
import { TaskItem } from "./task-item.model";

export class Chrono {
  day: number
  month: number
  year: number
  dayOfWeek: DayOfWeek
  items: TaskItem[]
  length?: number
}
