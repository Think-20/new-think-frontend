import { Employee } from "../employees/employee.model";
import { Task } from "../schedule/task.model";

export class Budget {
  id?: number;
  task_id: number;
  attendance_value: string;
  production_value: string;
  bv_value: string;
  tax_value: string;
  total_cost: string;
  orders_value: string;
}

/* export class Budget {
  id: number
  responsible_id?: number
  responsible?: Employee
  task_id?: number
  task?: Task
  gross_value: number
  optional_value: number
  bv_value: number
  equipments_value: number
  logistics_value: number
  sales_commission_value: number
  tax_aliquot: number
  others_value: number
  markup_aliquot: number
  created_at?: string
  updated_at?: string
} */
