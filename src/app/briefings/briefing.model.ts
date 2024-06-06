import { Stand } from "../stand/stand.model";
import { Employee } from "../employees/employee.model";
import { BriefingPresentation } from "../briefing-presentations/briefing-presentation.model";

export class Briefing {
  id: number
  stand?: Stand
  available_date: string
  responsible_id: number
  responsible?: Employee
  estimated_time: number
  presentations?: BriefingPresentation
}
