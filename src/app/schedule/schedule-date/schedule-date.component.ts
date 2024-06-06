import { Component, OnInit, Input } from '@angular/core';
import { ScheduleDate } from './schedule-date.model';
import { DatePipe } from '@angular/common';
import { MONTHS } from 'app/shared/date/months';
import { DAYSOFWEEK } from 'app/shared/date/days-of-week';

@Component({
  selector: 'cb-schedule-date',
  templateUrl: './schedule-date.component.html',
  styleUrls: ['./schedule-date.component.css']
})
export class ScheduleDateComponent implements OnInit {

  @Input() item: ScheduleDate;
  day: string;
  weekDay: string;
  month: string;

  constructor(
    private datePipe: DatePipe,
  ) {

  }

  ngOnInit() {
    let date = new Date(this.item.date + "T00:00:00")

    this.day = this.datePipe.transform(date, 'dd')
    this.month = MONTHS.find((month) => month.id == date.getMonth() + 1).name
    this.weekDay = DAYSOFWEEK.find((days) => days.id == date.getDay()).abbrev
  }

}
