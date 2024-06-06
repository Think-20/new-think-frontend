import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/operator/debounceTime';


import { API } from '../app.api';
import { ErrorHandler } from '../shared/error-handler.service';
import { Job } from './job.model';
import { AuthService } from '../login/auth.service';
import { Pagination } from 'app/shared/pagination.model';
import { Client } from '../clients/client.model';
import { DataInfo } from '../shared/data-info.model';
import { PerformanceReportLite } from '../reports/performance-report-lite/performance-report-lite.model';


@Injectable()
export class JobService {
  data: Job = new Job
  searchValue = {}
  pageIndex = 0

  constructor(
    private http: Http,
    private snackBar: MatSnackBar,
    private auth: AuthService
  ) { }

  displayNameEvent(job: Job, client: Client = null): string {
    if (client != null) {
      job.client = client
    }
    
    const fantasyName = (job.client && job.client.fantasy_name) ? job.client.fantasy_name : job.not_client;
    let name = (!fantasyName && job.not_client == '' || job.not_client == null) ? '' : fantasyName;
    return name + ' - ' + job.event
  }

  displayNameJob(job: Job, client: Client = null): string {
    if (client != null) {
      job.client = client
    }
    
    const fantasyName = (job.client && job.client.fantasy_name) ? job.client.fantasy_name : job.not_client;
    let name = (!fantasyName && job.not_client == '' || job.not_client == null) ? '' : fantasyName;
    return name;
  }

  displayCreation(job: Job): string {
    return job.creation_responsible != null ? job.creation_responsible.name : 'Externo'
  }

  showId(job: Job): string {
    let size = 4
    let date = new Date(job.created_at)
    return (String('0').repeat(size) + job.code).substr((size * -1), size) + '/' + date.getFullYear()
  }

  loadFormData(): Observable<any> {
    let url = `jobs/load-form`

    return this.http.get(`${API}/${url}`)
      .map(response => response.json())
      .catch((err) => {
        this.snackBar.open(ErrorHandler.message(err), '', {
          duration: 3000
        })
        return ErrorHandler.capture(err)
      })
  }

  performanceLite(params?: {}): Observable<PerformanceReportLite> {
    let url = `jobs/performance-lite`

    return this.http.post(`${API}/${url}`,
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

  jobs(params?: {}, page: number = 0): Observable<DataInfo> {
    let url = params === {} ? `jobs/all?page=${page}` : `jobs/filter?page=${page}`
    let prefix = this.auth.hasAccess('jobs/all') ? '' : 'my-'

    url = prefix + url

    return this.http.post(`${API}/${url}`,
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

  job(jobId: number): Observable<Job> {
    let url = `jobs/get/${jobId}`
    let prefix = this.auth.hasAccess('jobs/get/{id}') ? '' : 'my-'

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

  save(job: Job): Observable<any> {
    let url = 'job/save'
    let prefix = this.auth.hasAccess('job/save') ? '' : 'my-'

    url = prefix + url

    return this.http.post(
      `${API}/${url}`,
      JSON.stringify(job),
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

  edit(job: Job): Observable<any> {
    let url = 'job/edit'
    let prefix = this.auth.hasAccess('job/edit') ? '' : 'my-'

    url = prefix + url

    return this.http.put(
      `${API}/${url}`,
      JSON.stringify(job),
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
    let url = `job/remove/${id}`
    let prefix = this.auth.hasAccess('job/remove/{id}') ? '' : 'my-'

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

  download(job: Job, type: String, filename: String) {
    let url = `job/download/${job.id}/${type}/${filename}`
    let prefix = this.auth.hasAccess('job/download/{id}/{type}/{file}') ? '' : 'my-'

    url = prefix + url

    return this.http.get(`${API}/${url}`, { responseType: ResponseContentType.Blob }).map(
      (res) => {
        return new Blob([res.blob()], { type: res.headers.get('content-type') })
      })
      .catch((err) => {
        this.snackBar.open(ErrorHandler.message(err), '', {
          duration: 3000
        })
        return ErrorHandler.capture(err)
      })
  }

  previewFile(job: Job, type: string, file: string) {
    let url = `job/download/${job.id}/${type}/${file}?access_token=${this.auth.token()}&user_id=${this.auth.currentUser().id}`
    let prefix = this.auth.hasAccess('job/download/{id}/{type}/{file}') ? '' : 'my-'

    url = prefix + url

    window.open(`${API}/${url}`, '_blank')
  }
}
