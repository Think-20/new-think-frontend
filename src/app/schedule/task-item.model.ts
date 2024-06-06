import { Task } from "./task.model";

export class TaskItem {
  id: number
  task_id: number
  task?: Task
  date: string
  budget_value: number
  duration: number
  responsible_id?: number
}
