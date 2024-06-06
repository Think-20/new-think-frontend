import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/operator/debounceTime';


import { API } from '../app.api';
import { ErrorHandler } from '../shared/error-handler.service';
import { Task } from './task.model';
import { AuthService } from '../login/auth.service';
import { Pagination } from 'app/shared/pagination.model';
import { JobActivity } from '../job-activities/job-activity.model';
import { DataInfo } from '../shared/data-info.model';
import { DatePipe } from '@angular/common';
import { StringHelper } from 'app/shared/string-helper.model';
import { Employee } from 'app/employees/employee.model';


@Injectable()
export class TaskService {
  searchValue = {}
  pageIndex = 0

  constructor(
    private http: Http,
    private httpClient: HttpClient,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar,
    private auth: AuthService
  ) {}

  jobDisplay(task: Task, noAbbreviation: boolean = false) {
    if(task.job_activity.description == 'Memorial descritivo') {
      let jobDescription = 'M. descritivo'

      if(noAbbreviation)
        jobDescription = 'Memorial descritivo'

      return jobDescription + ' de ' + task.task.job_activity.description.toLowerCase() + ' ' + StringHelper.padChar(task.task.reopened)
    }

    return task.job_activity.description +  ' ' + StringHelper.padChar(task.reopened)
  }

  budgetDisplay(task: Task, noAbbreviation: boolean = false) {
    const dsc = `Orçamento ${task.reopened === 0 ? 'do ' : 'da '}`;
    return dsc + task.job_activity.description.replace('de', 'do').replace('Modificação', `Modificação ${StringHelper.padChar(task.reopened)}`).toLowerCase();
  }

  proposalsDisplay(task: Task, noAbbreviation: boolean = false) {
    if(task.job_activity.description == 'Memorial descritivo') {
      let jobDescription = 'M. descritivo'

      if(noAbbreviation)
        jobDescription = 'Proposta da modificação'

      return jobDescription + ' ' + StringHelper.padChar(task.task.reopened) + ' ' + task.task.job_activity.description.replace('Modificação', '').toLowerCase()
    }

    return task.job_activity.description +  ' ' + StringHelper.padChar(task.reopened)
  }

  especificationDisplay(task: Task, noAbbreviation: boolean = false) {
    if(task.job_activity.description == 'Memorial descritivo') {
      let jobDescription = 'M. descritivo'

      if(noAbbreviation)
        jobDescription = 'Memorial descritivo'

      return jobDescription + ' de ' + task.task.job_activity.description.toLowerCase() + ' ' + StringHelper.padChar(task.task.reopened)
    }

    const dsc = 'Memorial descritivo da modificação';
    return dsc + ' ' + StringHelper.padChar(task.reopened) + ' ' + task.job_activity.description.replace('Modificação', '').toLowerCase()
  }

  loadFormData(): Observable<any> {
    let url = `tasks/load-form`

    return this.http.get(`${API}/${url}`)
        .map(response => response.json())
        .catch((err) => {
            this.snackBar.open(ErrorHandler.message(err), '', {
                duration: 3000
            })
            return ErrorHandler.capture(err)
        })
  }

  /*
  recalculateNextDate(nextEstimatedTime): Observable<any> {
    let url = `tasks/recalculate-next-date/${nextEstimatedTime}`

    return this.http.get(`${API}/${url}`)
        .map(response => response.json())
        .catch((err) => {
            this.snackBar.open(ErrorHandler.message(err), '', {
                duration: 3000
            })
            return ErrorHandler.capture(err)
        })
  }
  */

  responsiblesByActivity(jobActivityId: number): Observable<Employee[]> {
    let url = `tasks/${jobActivityId}/responsibles`

    return this.http.get(`${API}/${url}`)
        .map(response => response.json())
        .catch((err) => {
            this.snackBar.open(ErrorHandler.message(err), '', {
                duration: 3000
            })
            return ErrorHandler.capture(err)
        })
  }

  taskItems(params?: {}, page: number = 0): Observable<any> {
      let url = params === {} ? `task-items/all?page=${page}` : `task-items/filter?page=${page}`
      let prefix = (this.auth.hasAccess('tasks/all') || this.auth.hasAccess('task-items/filter')) ? '' : 'my-'

      url = prefix + url

      return this.httpClient.post(`${API}/${url}`,
            JSON.stringify(params)
          )
          .catch((err) => {
              this.snackBar.open(ErrorHandler.message(err), '', {
                  duration: 3000
              })
              return ErrorHandler.capture(err)
          })
  }

  tasks(params?: {}, page: number = 0): Observable<any> {
      let url = params === {} ? `tasks/all?page=${page}` : `tasks/filter?page=${page}`
      let prefix = (this.auth.hasAccess('tasks/all') ||  this.auth.hasAccess('tasks/filter')) ? '' : 'my-'

      url = prefix + url

      return this.httpClient.post(`${API}/${url}`,
            JSON.stringify(params)
          )
          .catch((err) => {
              this.snackBar.open(ErrorHandler.message(err), '', {
                  duration: 3000
              })
              return ErrorHandler.capture(err)
          })
  }

  updatedInfo(): Observable<any> {
      let url = `tasks/updated-info`

      return this.http.get(`${API}/${url}`)
          .map(response => response.json())
          .catch((err) => {
              this.snackBar.open(ErrorHandler.message(err), '', {
                  duration: 3000
              })
              return ErrorHandler.capture(err)
          })
  }

  task(taskId: number): Observable<Task> {
      let url = `tasks/get/${taskId}`
      let prefix = this.auth.hasAccess('tasks/get/{id}') ? '' : 'my-'

      url = prefix + url

      return this.http.get(`${API}/${url}`)
          .map(response => response.json())
          .catch((err) => {
              this.snackBar.open(ErrorHandler.message(err), '', {
                  duration: 3000
              })
              return ErrorHandler.capture(err)
          })
  }

  getNextAvailableDate(availableDate: string, estimatedTime: number, jobActivity: JobActivity, budgetValue: number): Observable<any> {
      let url = `tasks/get-next-available-date/${availableDate}/${estimatedTime}/${jobActivity.description}/${budgetValue}`

      return this.http.get(`${API}/${url}`)
          .map(response => response.json())
          .catch((err) => {
              this.snackBar.open(ErrorHandler.message(err), '', {
                  duration: 3000
              })
              return ErrorHandler.capture(err)
          })
  }

  getAvailableDates(params = {}): Observable<any> {
      let url = `tasks/get-available-dates`

      return this.http.post(`${API}/${url}`,
          JSON.stringify(params),
          new RequestOptions())
          .map(response => response.json())
          .catch((err) => {
              this.snackBar.open(ErrorHandler.message(err), '', {
                  duration: 3000
              })
              return ErrorHandler.capture(err)
          })
  }

  save(task: Task): Observable<any> {
      let url = 'task/save'
      let prefix = this.auth.hasAccess('task/save') ? '' : 'my-'

      url = prefix + url

      return this.http.post(
              `${API}/${url}`,
              JSON.stringify(task),
              new RequestOptions()
          )
          .map(response => response.json())
          .catch((err) => {
              this.snackBar.open(ErrorHandler.message(err), '', {
                  duration: 3000
              })
              return ErrorHandler.capture(err)
          })
  }

  insertDerived(params = {}): Observable<any> {
      let url = 'task/insert-derived'

      return this.http.post(
              `${API}/${url}`,
              JSON.stringify(params),
              new RequestOptions()
          )
          .map(response => response.json())
          .catch((err) => {
              this.snackBar.open(ErrorHandler.message(err), '', {
                  duration: 3000
              })
              return ErrorHandler.capture(err)
          })
  }

  edit(task: Task): Observable<any> {
      let url = 'task/edit'
      let prefix = this.auth.hasAccess('task/edit') ? '' : 'my-'

      url = prefix + url

      return this.http.put(
              `${API}/${url}`,
              JSON.stringify(task),
              new RequestOptions()
          )
          .map(response => response.json())
          .catch((err) => {
              this.snackBar.open(ErrorHandler.message(err), '', {
                  duration: 3000
              })
              return ErrorHandler.capture(err)
          })
  }

  editAvailableDate(params: {}): Observable<any> {
      let url = 'task/edit-available-date'
      let prefix = this.auth.hasAccess('task/edit-available-date') ? '' : 'my-'

      url = prefix + url

      return this.http.put(
              `${API}/${url}`,
              JSON.stringify(params),
              new RequestOptions()
          )
          .map(response => response.json())
          .catch((err) => {
              this.snackBar.open(ErrorHandler.message(err), '', {
                  duration: 3000
              })
              return ErrorHandler.capture(err)
          })
  }

  delete(id: number): Observable<any> {
      let url = `task/remove/${id}`
      let prefix = this.auth.hasAccess('task/remove/{id}') ? '' : 'my-'

      url = prefix + url

      return this.http.delete(`${API}/${url}`)
          .map(response => response.json())
          .catch((err) => {
              this.snackBar.open(ErrorHandler.message(err), '', {
                  duration: 3000
              })
              return ErrorHandler.capture(err)
          })
  }

  changeValues(task: Task): Observable<any> {
    let url = 'tasks/change-values'
    // let prefix = this.auth.hasAccess('tasks/change-values') ? '' : 'my-'

    // url = prefix + url

    return this.http.post(
            `${API}/${url}`,
            JSON.stringify(task),
            new RequestOptions()
        )
        .map(response => response.json())
        .catch((err) => {
            this.snackBar.open(ErrorHandler.message(err), '', {
                duration: 3000
            })
            return ErrorHandler.capture(err)
        })
}
}
