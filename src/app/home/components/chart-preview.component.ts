import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { MONTHS, Month } from 'app/shared/date/months';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'cb-chart-preview',
  templateUrl: './chart-preview.component.html',
  styleUrls: ['./chart-preview.component.css']
})
export class ChartPreviewComponent implements OnInit {
  chartOptionsPie = {
    series: [44, 55, 13, 43, 22],
    chart: {
      type: "donut",
      width: "200%" ,
    },
    labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
  };

  searchForm: FormGroup;
  formCopy: any;
  hasFilterActive = false
  searching = false
  filter = false
  params = {}
  date: Date;
  month: Month;
  nextMonth: Month;
  year: number;
  years: number[] = []
  iniDate: Date;
  finDate: Date;
  months: Month[] = MONTHS
  nextMonthName: string = '';
  nextYear: number = 0;
 
  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    public dialog: MatDialog
    ) { }

  ngOnInit() {
   
  }  
}
