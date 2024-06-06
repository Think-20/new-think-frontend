import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { EmployeeService } from '../employee.service';
import { Employee } from '../employee.model';
import { JobService } from '../../jobs/job.service';
import { API } from '../../app.api';

@Component({
  selector: 'cb-employee-show',
  templateUrl: './employee-show.component.html',
  styleUrls: ['./employee-show.component.css']
})
export class EmployeeShowComponent implements OnInit {

  employee: Employee
  API = API

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private jobService: JobService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    let snackBar
    let employeeId = this.route.params.subscribe(param => {
      snackBar = this.snackBar.open('Carregando funcionário...')
      this.employeeService.employee(this.route.snapshot.params['id'])
      .subscribe(employee => {
        this.employee = employee
        snackBar.dismiss()
      })
    })
  }

}
