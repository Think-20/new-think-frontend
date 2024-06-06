import { Component, OnInit, Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { trigger, style, state, transition, animate, keyframes } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';

import { JobService } from '../job.service';
import { Job } from '../job.model';
import { Pagination } from 'app/shared/pagination.model';
import { Employee } from '../../employees/employee.model';
import { EmployeeService } from '../../employees/employee.service';
import { JobStatus } from 'app/job-status/job-status.model';
import { JobStatusService } from 'app/job-status/job-status.service';
import { distinctUntilChanged, debounceTime, tap, isEmpty } from 'rxjs/operators';
import { Client } from '../../clients/client.model';
import { AuthService } from '../../login/auth.service';
import { ClientService } from '../../clients/client.service';
import { JobType } from '../../job-types/job-type.model';
import { JobTypeService } from '../../job-types/job-type.service';
import { DataInfo } from '../../shared/data-info.model';

@Component({
  selector: 'cb-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css'],
  animations: [
    trigger('rowAppeared', [
      state('ready', style({ opacity: 1 })),
      transition('void => ready', animate('300ms 0s ease-in', keyframes([
        style({ opacity: 0, transform: 'translateX(-30px)', offset: 0 }),
        style({ opacity: 0.8, transform: 'translateX(10px)', offset: 0.8 }),
        style({ opacity: 1, transform: 'translateX(0px)', offset: 1 })
      ]))),
      transition('ready => void', animate('300ms 0s ease-out', keyframes([
        style({ opacity: 1, transform: 'translateX(0px)', offset: 0 }),
        style({ opacity: 0.8, transform: 'translateX(-10px)', offset: 0.2 }),
        style({ opacity: 0, transform: 'translateX(30px)', offset: 1 })
      ])))
    ])
  ]
})
@Injectable()
export class JobListComponent implements OnInit {

  rowAppearedState: string = 'ready'
  searchForm: FormGroup
  formCopy: any
  search: FormControl
  pagination: Pagination
  jobs: Job[] = []
  dataInfo: DataInfo
  paramAttendance: Employee = null
  attendances: Employee[]
  creations: Employee[]
  clients: Client[]
  status: JobStatus[]
  job_types: JobType[]
  searching = false
  pageIndex: number
  filter = false
  params = {}
  hasFilterActive = false
  isAdmin: boolean = false

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private clientService: ClientService,
    private jobService: JobService,
    private jobTypeService: JobTypeService,
    private jobStatus: JobStatusService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.isAdmin = this.authService.hasAccess('job/save')

    this.loadFilterData()
    this.pageIndex = this.jobService.pageIndex

    this.paramAttendance = this.authService.currentUser().employee.department.description === 'Atendimento'
      ? this.authService.currentUser().employee : null

    this.createForm()
    this.loadInitialData()
  }

  createForm() {
    this.search = this.fb.control('')
    this.searchForm = this.fb.group({
      search: this.search,
      creation: this.fb.control(''),
      job_type: this.fb.control(''),
      client: this.fb.control(''),
      status: this.fb.control(''),
      initial_date: this.fb.control(''),
      final_date: this.fb.control(''),
    })

    if(this.isAdmin)
      this.searchForm.addControl('attendance', this.fb.control({ value: '' }))

    this.formCopy = this.searchForm.value

    if(JSON.stringify(this.jobService.searchValue) == JSON.stringify({})) {
      this.jobService.searchValue = this.searchForm.value
    } else {
      this.searchForm.setValue(this.jobService.searchValue)
    }

    this.searchForm.controls.client.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(500))
      .subscribe(clientName => {
        this.clientService.clients({ search: clientName, attendance: this.paramAttendance }).subscribe((dataInfo) => {
          this.clients = dataInfo.pagination.data
        })
      })

    this.searchForm.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(500))
      .subscribe((searchValue) => {
        this.params = this.getParams(searchValue)
        this.loadJobs(this.params, 1)

        this.pageIndex = 0
        this.jobService.pageIndex = 0
        this.jobService.searchValue = searchValue
        this.updateFilterActive()
      })
  }

  getParams(searchValue) {
    let status = searchValue.status != undefined ? searchValue.status.id : null
    let clientName = searchValue.client != '' ? searchValue.client : searchValue.search
    let attendanceFilter = this.isAdmin ? { attendance: searchValue.attendance } : {}

    return {
      creation: searchValue.creation,
      job_type: searchValue.job_type,
      final_date: searchValue.final_date,
      initial_date: searchValue.initial_date,
      clientName: clientName,
      status: status,
      ...attendanceFilter
    }
  }

  updateFilterActive() {
    if (JSON.stringify(this.jobService.searchValue) === JSON.stringify(this.formCopy)) {
      this.hasFilterActive = false
    } else {
      this.hasFilterActive = true
    }
  }

  clearFilter() {
    this.jobService.searchValue = {}
    this.jobService.pageIndex = 0
    this.pageIndex = 0
    this.createForm()
    this.loadInitialData()
  }

  loadInitialData() {
    if (JSON.stringify(this.jobService.searchValue) === JSON.stringify(this.formCopy)) {
      this.loadJobs({}, this.pageIndex + 1)
    } else {
      this.params = this.getParams(this.jobService.searchValue)
      this.loadJobs(this.params, this.pageIndex + 1)
    }

    this.updateFilterActive()
  }

  loadJobs(params, page: number) {
    if(this.searching) return

    this.searching = true
    let snackBar = this.snackBar.open('Carregando jobs...')
    this.jobService.jobs(params, page).subscribe(dataInfo => {
      this.dataInfo = dataInfo
      this.pagination = dataInfo.pagination
      this.jobs = dataInfo.pagination.data
      this.searching = false
      snackBar.dismiss()
    })
  }

  loadFilterData() {
    this.jobStatus.jobStatus().subscribe(status => this.status = status)

    this.jobTypeService.jobTypes().subscribe(job_types => this.job_types = job_types)

    this.employeeService.employees({
      paginate: false,
      deleted: true
    }).subscribe(dataInfo => {
      let employees = dataInfo.pagination.data
      this.creations = employees.filter(employee => {
        return employee.department.description === 'Criação'
      })

      this.attendances = employees.filter(employee => {
        return employee.department.description === 'Atendimento' || employee.department.description === 'Diretoria'
      })
    })
  }

  editStatus(event, job: Job) {
    let status = event.value as JobStatus
    let oldStatus = job.status
    job.status = status
    this.jobService.edit(job).subscribe(data => {
      if (data.status == true) {
        this.snackBar.open('Atualizado com sucesso!', '', {
          duration: 3000
        })
      } else {
        job.status = oldStatus
        this.snackBar.open('Erro ao atualizar.', '', {
          duration: 3000
        })
      }
    })
  }

  compareAttendance(var1: Employee, var2: Employee) {
    return var1.id === var2.id
  }

  compareStatus(var1: JobStatus, var2: JobStatus) {
    return var1.id === var2.id
  }

  compareJobType(var1: JobType, var2: JobType) {
    return var1.id === var2.id
  }

  changePage($event) {
    this.searching = true
    this.jobs = []
    this.jobService.jobs(this.jobService.searchValue, ($event.pageIndex + 1)).subscribe(dataInfo => {
      this.dataInfo = dataInfo
      this.pagination = dataInfo.pagination
      this.jobs = dataInfo.pagination.data
      this.searching = false
      this.pageIndex = $event.pageIndex
      this.jobService.pageIndex = this.pageIndex
    })
  }

  permissionVerify(module: string, job: Job): boolean {
    let access: boolean
    let employee = this.authService.currentUser().employee
    switch (module) {
      case 'new': {
        access = this.authService.hasAccess('job/save')
        break
      }
      case 'show': {
        access = job.attendance.id != employee.id ? this.authService.hasAccess('jobs/get/{id}') : true
        break
      }
      case 'edit': {
        access = job.attendance.id != employee.id ? this.authService.hasAccess('job/edit') : true
        break
      }
      case 'delete': {
        access = job.attendance.id != employee.id ? this.authService.hasAccess('job/remove/{id}') : true
        break
      }
      default: {
        access = false
        break
      }
    }
    return access
  }

  delete(job: Job) {
    this.jobService.delete(job.id).subscribe((data) => {
      this.snackBar.open(data.message, '', {
        duration: 5000
      })

      if (data.status) {
        this.jobs.splice(this.jobs.indexOf(job), 1)
        this.pagination.total = this.pagination.total - 1
      }
    })
  }

}
