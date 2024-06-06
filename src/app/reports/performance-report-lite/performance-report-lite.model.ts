export class PerformanceReportLite {
  opportunity: Opportunity
  tendency: Tendency
  monthly_approval: MonthlyApproval
  consolidated_annual: ConsolidatedAnnual
}

class Opportunity {
  value: number
  quantity: number
}

class Tendency {
  quantity_total: number 
  quantity_approved: number
  budget_total: number
  budget_approved: number
}

class MonthlyApproval {
  quantity_total: number 
  quantity_approved: number
  budget_approved: number
}

class ConsolidatedAnnual {
  quantity_total: number 
  quantity_approved: number
  budget_approved: number
}
