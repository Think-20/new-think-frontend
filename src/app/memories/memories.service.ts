import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { API } from '../../app/app.api';
import { Observable } from 'rxjs';
import { ErrorHandler } from 'app/shared/error-handler.service';
import { Memory } from './memories.model';



@Injectable()
export class MemoriesService {

  constructor(
    private http: Http,
    private snackBar: MatSnackBar,
  ) { }

  getMemories(): Observable<Memory[]> {
    let url = `reminders`;

    return this.http.get(`${API}/${url}`)
      .map(response => response.json())
      .catch((err) => {
        this.snackBar.open(ErrorHandler.message(err), '', {
          duration: 3000
        });
        return ErrorHandler.capture(err);
      });
  }

  updateReadMemory(id: number): Observable<string> {
    const url = `reminders/read/${id}`

    return this.http.put(
      `${API}/${url}`,
      JSON.stringify(id),
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
