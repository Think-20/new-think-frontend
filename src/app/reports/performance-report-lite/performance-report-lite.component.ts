import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Employee } from '../../employees/employee.model';
import { EmployeeService } from '../../employees/employee.service';
import { JobService } from '../../jobs/job.service';
import { PerformanceReportLite } from './performance-report-lite.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MONTHS, Month } from '../../shared/date/months';
import { Patterns } from '../../shared/patterns.model';

@Component({
  selector: 'cb-performance-report-lite',
  templateUrl: './performance-report-lite.component.html',
  styleUrls: ['./performance-report-lite.component.css']
})
export class PerformanceReportLiteComponent implements OnInit {

  months: Month[] = MONTHS
  date: Date
  filterOpen: boolean = true
  searchForm: FormGroup
  performanceLite: PerformanceReportLite
  attendances: Employee[]
  opportunity_quantity_goal: number = 42
  opportunity_value_goal: number = 4500000
  tendency_quantity_goal: number = 30
  tendency_value_goal: number = 1200000
  monthly_approval_quantity_goal: number = 30
  monthly_approval_value_goal: number = 1200000
  consolidated_annual_quantity_goal: number = 30
  consolidated_annual_value_goal: number = 12000000

  constructor(
    private formBuilder: FormBuilder,
    private jobService: JobService,
    private snackbar: MatSnackBar,
    private employeeService: EmployeeService
  ) { }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      month: this.formBuilder.control('', [
        Validators.required
      ]),
      year: this.formBuilder.control('', [
        Validators.required,
        Validators.pattern(Patterns.number)
      ]),
      time_to_analyze: this.formBuilder.control('', [
        Validators.required
      ]),
      attendances: this.formBuilder.control('')
    })

    this.loadData()
    this.listenForm()
  }

  loadData() {
    this.employeeService.employees().subscribe((dataInfo) => {
      let employees = <Employee[]> dataInfo.pagination.data
      this.attendances = employees.filter((employee) => employee.department.description === 'Atendimento' || employee.department.description === 'Diretoria')
    })

    this.date = new Date
    this.searchForm.controls.year.setValue(this.date.getFullYear())

    let month = this.months.find((month) => {
      return month.id == (this.date.getMonth() + 1)
    })
    this.searchForm.controls.month.setValue(month)
  }

  listenForm() {
    let snackbar
    this.searchForm.valueChanges
    .do(() => {
      if(!this.searchForm.valid) return

      snackbar = this.snackbar.open('Aguarde...')
    })
    .debounceTime(500)
    .subscribe((params) => {
      if(!this.searchForm.valid) return

      this.jobService.performanceLite(params).subscribe((performanceLite) => {
        this.performanceLite = performanceLite
        snackbar.dismiss()
      })
    })
  }

  percent(value: number, goal: number) {
    return ((value * 100 / goal) - 100).toFixed(0)
  }

  compareAttendance(var1: Employee, var2: Employee) {
    return var1.id === var2.id
  }

  compareMonth(var1: Month, var2: Month) {
    return var1.id === var2.id
  }
}
