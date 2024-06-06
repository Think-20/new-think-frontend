import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { MONTHS, Month } from 'app/shared/date/months';
import { HomeService } from './home.service';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { HomeData } from './models/home-data.model';
import { HomeInfo } from './models/home-info.model';
import { ChartPreviewComponent } from './components/chart-preview.component';

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexPlotOptions,
  ApexStates,
  ApexTheme,
  ApexTitleSubtitle
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  fill: any;
  stroke: ApexStroke;
  states: ApexStates;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  theme: ApexTheme;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  colors: any;
};
@Component({
  selector: 'cb-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  chartOptions = {
    series: [
      {
        name: "High - 2013",
        data: [28, 29, 33, 30, 45, 68, 68, 43, 42, 55, 33, 33],
      },
      {
        name: "Low - 2013",
        data: [12, 20, 25, 60, 32, 20, 10, 50, 25, 33, 33, 33]
      }
    ],
    chart: {
      height: 150,
      type: "line",
      toolbar: {
        show: false
      }
    },
    grid: {
      borderColor: "#fff", // Cor das bordas da grade
      position: "back", // Coloca a grade atrás do gráfico
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    colors: ["#77B6EA", "#545454"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
      width: [2, 4]
    },
    markers: {
      size: 1
    },
    xaxis: {
      categories: ["Jan 23", "Fev 23", "Mar 23", "Abr 23", "Mai 23", "Jun 23", "Jul 23", "Ago 23", "Set 23", "Out 23", "Nov 23", "Dez 23"],
    },
    yaxis: {
      show: false,
    },
    legend: {
      show: false
    }
  };

  chartOptionsPieJobs: Partial<ChartOptions> = {
    series: [20, 10, 10, 30, 40],
    chart: {
      width: 270,
      type: "donut",
    },
    stroke: {
      width: 0, 
    },
    legend: {
      show: false
    },
    plotOptions: {
      pie: {
        donut: {
          size: "80%",
          labels: {
            show: true,
            total: {
              showAlways: true,
              show: true,
              fontSize: "80px",
              fontFamily: "-apple-system,BlinkMacSystemFont, Segoe UI ,Roboto, Helvetica Neue,Arial,sans-serif",
              color: "#57585a",
              fontWeight: "300",
              formatter: (a) => "1.200.000",
              label: '103'
            },
            value: {
              fontFamily: "-apple-system,BlinkMacSystemFont, Segoe UI ,Roboto, Helvetica Neue,Arial,sans-serif",
              color: "#57585a",
              fontWeight: "100",
              fontSize: "20px",
              offsetY: 25,
            },
            name : {
              offsetY: 10
            }
          }
        }
      }
    },
    labels: ["Aprovados", "Avançados", "Ajustes", "Stand-By", 'Reprovados'],
    dataLabels: {
      enabled: false
    },
    colors: ["#adca5f", "#e82489", "#4fa2b1", "#00abeb", "#ffcd37"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: "bottom"
          }
        }
      }
    ]
  };

  chartOptionsPie: Partial<ChartOptions> = {
    series: [44, 55, 41, 17],
    chart: {
      width: 270,
      type: "donut",
    },
    stroke: {
      width: 0
    },
    legend: {
      position: "left",
      markers: {
        radius: 0,
        height: 10,

      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: "80%",
          labels: {
            show: true,
            total: {
              showAlways: true,
              show: true,
              fontSize: "50px",
              fontFamily: "-apple-system,BlinkMacSystemFont, Segoe UI ,Roboto, Helvetica Neue,Arial,sans-serif",
              color: "#57585a",
              fontWeight: "300",
              formatter: (a) => "1.200.000",
              label: '103'
            },
            value: {
              fontFamily: "-apple-system,BlinkMacSystemFont, Segoe UI ,Roboto, Helvetica Neue,Arial,sans-serif",
              color: "#57585a",
              fontWeight: "100",
              fontSize: "15px",
              offsetY: 15,
            },
            name : {
              offsetY: 10
            }
          }
        }
      }
    },
    labels: ["Cenografia", "Stand", "PDV", "Showrooms", 'Outsiders'],
    colors: ["#adca5f", "#e82489", "#4fa2b1", "#00abeb", "#ffcd37"],
    dataLabels: {
      enabled: false
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: "bottom"
          }
        }
      }
    ]
  };

  searchForm: FormGroup;
  formCopy: any;
  dataInfo: HomeInfo;
  hasFilterActive = false
  searching = false
  filter = false
  params = {}
  homeData: HomeData;
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
    private homeService: HomeService,
    public dialog: MatDialog
    ) { }

  ngOnInit() {
    this.createForm();
    this.setYears();
    this.loadInitialData();
  }
  
  createForm() {
    this.searchForm = this.fb.group({
      date_init: this.fb.control(''),
      date_end: this.fb.control(''),
    })

    this.formCopy = this.searchForm.value;

    if(JSON.stringify(this.homeService.searchValue) == JSON.stringify({})) {
      this.homeService.searchValue = this.searchForm.value;
    } else {
      this.searchForm.setValue(this.homeService.searchValue);
    }

    this.searchForm.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(500))
      .subscribe((searchValue) => {
        this.params = this.getParams(searchValue);
        this.loadJobs(this.params);
        this.updateFilterActive();
        this.changeMonth();
      })
  }

  loadInitialData() {
    if (JSON.stringify(this.homeService.searchValue) === JSON.stringify(this.formCopy)) {
      this.params = this.getParams(this.homeService.searchValue);
      this.loadJobs({}, true);
    } else {
      this.params = this.getParams(this.homeService.searchValue);
      this.loadJobs(this.params, true);
    }

    this.updateFilterActive()
  }

  updateFilterActive() {
    if (JSON.stringify(this.homeService.searchValue) === JSON.stringify(this.formCopy)) {
      this.hasFilterActive = false;
    } else {
      this.hasFilterActive = true;
    }
  }

  addMonth(inc: number) {
    this.date.setDate(1);
    this.date.setMonth(this.date.getMonth() + inc);
    
    const nextMonthIndex = (this.date.getMonth() + 1) % 12;
    this.nextMonth = MONTHS.find(month => month.id == (nextMonthIndex + 1));
    this.nextYear = this.date.getFullYear() + (nextMonthIndex === 0 ? 1 : 0);
    
    this.month = MONTHS.find(month => month.id == (this.date.getMonth() + 1));
    this.year = this.date.getFullYear();

    this.changeMonth();
}

  changeMonth() {
    if(this.searching) return;
    let snackBar = this.snackBar.open('Carregando tarefas...');

    const daysInMonth = this.getDaysInMonth(this.year, this.nextMonth.id);
    this.iniDate = new Date(this.year + '-' + this.month.id + '-' + 1);
    this.finDate = new Date(this.nextYear + '-' + this.nextMonth.id + '-' + daysInMonth);

    this.iniDate.setDate(this.iniDate.getDate());
    this.finDate.setDate(this.finDate.getDate());

    this.homeService.searchValue = {
      ...this.homeService.searchValue,
      date_init:this.iniDate,
      date_end: this.finDate,
    }

    this.params = this.getParams(this.homeService.searchValue);
    this.loadJobs(this.params);
  }

  getParams(searchValue) {
    this.iniDate = this.homeService.searchValue.date_init ? this.homeService.searchValue.date_init : searchValue.date_init;
    this.finDate = this.homeService.searchValue.date_end ? this.homeService.searchValue.date_end : searchValue.date_end;

    this.homeService.searchValue = {
      ...searchValue,
      date_init:this.iniDate,
      date_end: this.finDate,
    }

    return {
      final_date: searchValue.final_date,
      date_end: this.finDate,
      date_init: this.iniDate,
    }
  }

  getDaysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
  }

  updateMonth(month: Month) {
    this.month = month;
    this.changeMonth();
  }

  updateNextMonth(month: Month) {
    this.nextMonth = month;
    this.changeMonth();
  }

  updateYear(year: number) {
    this.year = year;
    this.changeMonth();
  }

  updateNextYear(year: number) {
    this.nextYear = year;
    this.changeMonth();
  }

  setYears() {
    let ini = 2018;
    let year = (new Date).getFullYear();

    while (ini <= (year + 1)) {
      this.years.push(ini);
      ini += 1;
    }
  }

  clearFilter() {
    this.homeService.searchValue = {};
    this.createForm();
    this.loadInitialData();
  }

  loadJobs(params, configureDates = false) {
    let hasDateFilter = false;
    const filter: any = this.homeService.searchValue;

    if (filter) {
      hasDateFilter = !!(filter.date_init || filter.date_end);
    }

    if (hasDateFilter) {
      this.setCurrentDateFilterByDate(filter.date_init, filter.date_end);
    }

    this.searching = true;
    let snackBar = this.snackBar.open('Carregando jobs...');
    this.homeService.home(params)
    .subscribe(dataInfo => {
      if (configureDates && !hasDateFilter) {
        this.setDataByParams();
      }
      
      this.homeData = (dataInfo as unknown as HomeData);
      this.searching = false;
      snackBar.dismiss();
    })
  }

  setDataByParams() {
    this.date = new Date();

    this.route.queryParams.subscribe(params => {
      if (params.date != undefined) {
        this.date = new Date(params.date + "T00:00:00");
        this.month = MONTHS.find(month => month.id == (this.date.getMonth() + 1));
        this.year = this.date.getFullYear();
      } else {

        this.date = new Date();
        const nextDate = new Date();
        nextDate.setMonth(nextDate.getMonth());
        this.month = MONTHS.find(month => month.id == (this.date.getMonth() + 1));
        this.nextMonth = MONTHS[nextDate.getMonth()];

        this.year = this.date.getFullYear();
        this.nextYear = nextDate.getFullYear();
      }

      this.changeMonth();
    })
  }

  setCurrentDateFilterByDate(dateInit: Date, dateEnd: Date) {
    this.month = MONTHS.find(month => month.id == (dateInit.getMonth() + 1));
    this.year = dateInit.getFullYear();

    this.nextMonth = MONTHS.find(month => month.id == (dateEnd.getMonth() + 1));
    this.nextYear = dateEnd.getFullYear();
  }

  openChartDetails() {
    const dialogRef = this.dialog.open(ChartPreviewComponent);
  }
}