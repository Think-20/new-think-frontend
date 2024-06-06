import { Component, OnInit, Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { trigger, style, state, transition, animate, keyframes } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TimecardService } from '../timecard.service';
import { Timecard } from '../timecard.model';
import { Employee } from '../../employees/employee.model';
import { EmployeeService } from '../../employees/employee.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'cb-timecard-approvals',
  templateUrl: './timecard-approvals.component.html',
  styleUrls: ['./timecard-approvals.component.css'],
  animations: [
    trigger('rowAppeared', [
      state('ready', style({opacity: 1})),
      transition('void => ready', animate('300ms 0s ease-in', keyframes([
        style({opacity: 0, transform: 'translateX(-30px)', offset: 0}),
        style({opacity: 0.8, transform: 'translateX(10px)', offset: 0.8}),
        style({opacity: 1, transform: 'translateX(0px)', offset: 1})
      ]))),
      transition('ready => void', animate('300ms 0s ease-out', keyframes([
        style({opacity: 1, transform: 'translateX(0px)', offset: 0}),
        style({opacity: 0.8, transform: 'translateX(-10px)', offset: 0.2}),
        style({opacity: 0, transform: 'translateX(30px)', offset: 1})
      ])))
    ])
  ]
})
@Injectable()
export class TimecardApprovalsComponent implements OnInit {

  rowAppearedState: string = 'ready'
  searchForm: FormGroup
  search: FormControl
  timecards: Timecard[] = []
  searching: boolean

  constructor(
    private fb: FormBuilder,
    private timecardService: TimecardService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.searching = true
    this.timecardService.approvalsPending().subscribe((timecards) => {
      this.searching = false
      this.timecards = timecards
    })
  }

  approve(timecard: Timecard) {
    this.timecardService.approve(timecard.id).subscribe((data) => {
      this.snackBar.open(data.message, '', {
        duration: 5000
      })
      this.timecards.splice(this.timecards.indexOf(timecard), 1)
    })
  }

  delete(timecard: Timecard) {
    this.timecardService.delete(timecard.id).subscribe((data) => {
      this.snackBar.open(data.message, '', {
        duration: 5000
      })
      this.timecards.splice(this.timecards.indexOf(timecard), 1)
    })
  }
}
