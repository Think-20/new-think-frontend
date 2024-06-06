import { Employee } from "../employees/employee.model";
import { JobActivity } from "../job-activities/job-activity.model";
import { Job } from "../jobs/job.model";
import { TaskItem } from "./task-item.model";
import { ProjectFile } from "../projects/project-file.model";
import { Budget } from "../budgets/budget.model";
import { SpecificationFile } from "app/specification/specification-file.model";

export class Task {
  id: number
  responsible_id: number
  responsible?: Employee
  duration: number
  job_activity_id: number
  job_activity?: JobActivity
  job_id: number
  job?: Job
  reopened?: number
  items?: TaskItem[]
  project_files?: ProjectFile[]
  specification_files?: SpecificationFile[]
  budget?: Budget
  done?: number
  task_id?: number
  task?: Task
  orders_value?: number
  attendance_value?: number
  creation_value?: number
  pre_production_value?: number
  production_value?: number
  details_value?: number
  budget_si_value?: number
  bv_value?: number
  over_rates_value?: number
  discounts_value?: number
  taxes_value?: number
  logistics_value?: number
  equipment_value?: number
  total_cost_value?: number
  gross_profit_value?: number
  profit_value?: number
  final_value?: number
  updated_by?: string
  updated_at?: Date
}
