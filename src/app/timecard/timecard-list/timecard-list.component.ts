import { Component, OnInit, Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { trigger, style, state, transition, animate, keyframes } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TimecardService } from '../timecard.service';
import { Timecard } from '../timecard.model';
import { Employee } from '../../employees/employee.model';
import { EmployeeService } from '../../employees/employee.service';
import { Observable } from 'rxjs/Observable';
import { ErrorHandler } from '../../shared/error-handler.service';
import { Month, MONTHS } from '../../shared/date/months';
import { Pagination } from '../../shared/pagination.model';
import { TimecardPlace } from '../timecard-place/timecard-place.model';
import { TimecardPlaceService } from '../timecard-place/timecard-place.service';
import { AuthService } from '../../login/auth.service';

@Component({
  selector: 'cb-timecard-list',
  templateUrl: './timecard-list.component.html',
  styleUrls: ['./timecard-list.component.css'],
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
export class TimecardListComponent implements OnInit {

  rowAppearedState: string = 'ready'
  filterForm: FormGroup
  justifyForm: FormGroup
  activeCheckin: boolean = false
  activeCheckout: boolean = false
  date: Date = new Date()
  employees: Employee[]
  timecards: Timecard[] = []
  timecard: Timecard
  accessList: boolean = false
  accessEdit: boolean = false
  accessDelete: boolean = false
  accessAprove: boolean = false
  accessNew: boolean = false
  searching = false
  justifyPlace: boolean = false
  months: Month[] = MONTHS
  places: TimecardPlace[]
  totalBalance: string
  filtering: boolean = false

  constructor(
    private fb: FormBuilder,
    private timecardService: TimecardService,
    private auth: AuthService,
    private timecardPlaceService: TimecardPlaceService,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.timecardPlaceService.places().subscribe((places) => {
      this.places = places
    })

    this.filterForm = this.fb.group({
      month: this.fb.control(''),
      employee: this.fb.control(''),
      year: this.fb.control(''),
      place: this.fb.control('')
    })

    this.accessList = this.timecardService.hasAccess('list')
    this.accessAprove = this.timecardService.hasAccess('approve')
    this.accessEdit = this.timecardService.hasAccess('edit')
    this.accessDelete = this.timecardService.hasAccess('delete')
    this.accessNew = this.timecardService.hasAccess('new')

    this.justifyForm = this.fb.group({
      place_id: this.fb.control('', [
        Validators.required
      ]),
      place: this.fb.control('', [
        Validators.required
      ]),
      reason: this.fb.control('', [
        Validators.required
      ])
    })

    this.filterForm.valueChanges.subscribe(() => {
      this.filter()
    })

    //Habilitar somente quando a opção for externo.
    this.justifyForm.controls.place.disable()
    this.justifyPlace = false

    this.justifyForm.controls.place_id.valueChanges.subscribe((timecardPlace) => {
      if(timecardPlace.description != 'Externo') {
        this.justifyForm.controls.place.disable()
        this.justifyPlace = false
        return
      }

      this.justifyForm.controls.place.enable()
      this.justifyPlace = true
    })

    if(!this.accessNew) {
      this.renewStatus()
    } else {
      this.justifyForm.disable()
    }

   this.filterForm.controls.employee.valueChanges
   .debounceTime(500)
   .subscribe(value => {
      let snackBar = this.snackBar.open('Carregando registros...')
      this.employeeService.employees({ name: value }).subscribe(dataInfo => {
        this.searching = false
        this.employees = dataInfo.pagination.data
        snackBar.dismiss()
      })
    })

    let date = new Date()
    this.filterForm.controls.month.setValue(this.months.filter((month, index) => {
      return month.id == (date.getMonth() + 1)
    }).pop())
    this.filterForm.controls.year.setValue(date.getFullYear())

    if(!this.accessList) {
      this.filter()
    }
  }

  renewStatus() {
    this.timecardService.status().subscribe((timecards) => {
      if(timecards.length == 0) {
        this.activeCheckout = false
        this.activeCheckin = true
        this.justifyForm.controls.reason.disable()
      } else {
        this.activeCheckin = false
        this.activeCheckout = true
        this.timecard = timecards.pop()
        this.checkJustifyHours(new Date(this.timecard.entry), new Date())
        let checkChangeHours = Observable.timer(1000)
        checkChangeHours.subscribe((time) => {
          this.checkJustifyHours(new Date(this.timecard.entry), new Date())
        })
      }
    })
  }

  checkJustifyHours(date1: Date, date2: Date) {
    let entry = date1
    let exit = date2
    let diff = (new Date(exit).getTime() - new Date(entry).getTime()) / 1000

    if(isNaN(diff)) return

    //8 horas
    if(diff > 28800) {
      this.justifyForm.controls.reason.enable()
    }  else {
      this.justifyForm.controls.reason.disable()
    }
  }

  register(data: any) {
    this.activeCheckout = false
    this.activeCheckin = false

    let user = this.auth.currentUser()
    let isMobile = {
      Android: function() {
          return navigator.userAgent.match(/Android/i);
      },
      BlackBerry: function() {
          return navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: function() {
          return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera: function() {
          return navigator.userAgent.match(/Opera Mini/i);
      },
      Windows: function() {
          return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
      },
      any: function() {
          return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
      }
    };

    if(isMobile.any() || user.coordinatesNow == '' || user.coordinatesNow == null) {
      var geolocation = window.navigator.geolocation;
      let snack = this.snackBar.open('Aguarde, obtendo posicionamento e registrando...')

      geolocation.getCurrentPosition((geo) => {
        snack.dismiss()
        let lat = geo.coords.latitude
        let long = geo.coords.longitude
        data.coordinates = `${lat},${long}`
        user.coordinatesNow = data.coordinates
        this.registerInsert(data)
      }, (error) => {
        snack.dismiss()
        let code = error.code;
        let message;

        if(code == 1) {
          message = 'Sem permissão para recuperar a localização.';
        } else if(code == 2) {
          message = 'A obtenção da geolocalização falhou.';
        } else {
          message = 'Tempo de limite excedido para obter a localização';
        }

        this.snackBar.open(message, '', {
          duration: 5000
        })
      }, {timeout: 30000, enableHighAccuracy: true, maximumAge: 0})

      this.renewStatus()
      return;
    }

    data.coordinates = user.coordinatesNow
    this.registerInsert(data)
  }

  registerInsert(data: any) {
    if(ErrorHandler.formIsInvalid(this.justifyForm)) {
      this.renewStatus()
      this.snackBar.open('Por favor, preencha corretamente os campos.', '', {
        duration: 5000
      })
      return;
    }

    this.timecardService.register(data).subscribe(data => {
      this.snackBar.open(data.message, '', {
        duration: 5000
      })
      this.renewStatus()
      this.filter()
    })
  }

  total(timecards: Timecard[]): string {
    let formatedHours
    let formatedMin
    let diff
    let hours = 0
    let min = 0

    timecards.forEach((timecard) => {
      let entry = timecard.entry
      let exit = timecard.exit

      if(exit != null) {
        diff = (new Date(exit).getTime() - new Date(entry).getTime())/1000
        hours += diff > 3600 ? Math.floor((diff / 3600)) : 0
        min += (diff - (hours * 3600)) > 60 ? Math.floor(((diff - (hours * 3600)) / 60)) : 0
      }
    })

    formatedHours = hours
    formatedMin = min

    if(hours < 10) {
      formatedHours = '0' + hours
    }
    if(min < 10) {
      formatedMin = '0' + (parseFloat(min.toString()).toFixed(0)).toString()
    }

    return `${formatedHours}:${formatedMin}`
  }

  balance(timecards: Timecard[]): string {
    let formatedHours
    let formatedMin
    let seconds = 0
    let hours = 0
    let min = 0

    timecards.forEach((timecard) => {
      if(timecard.balance != null) {
        seconds += parseInt(timecard.balance.slice(0,2)) * 3600 + parseInt(timecard.balance.slice(3,5)) * 60
      }
    })

    hours = seconds > 3600 ? Math.floor((seconds / 3600)) : 0
    min = (seconds - (hours * 3600)) > 60 ? Math.floor(((seconds - (hours * 3600)) / 60)) : 0

    formatedHours = hours
    formatedMin = min

    if(hours < 10) {
      formatedHours = '0' + hours
    }
    if(min < 10) {
      formatedMin = '0' + (parseFloat(min.toString()).toFixed(0)).toString()
    }

    return `${formatedHours}:${formatedMin}`
  }

  delete(timecard: Timecard) {
    this.timecardService.delete(timecard.id).subscribe(() => {
      this.timecards.splice(this.timecards.indexOf(timecard), 1)
    })
  }

  filter() {
      this.searching = true
      this.timecardService.timecards(this.filterForm.value).subscribe((data) => {
      this.searching = false
      this.timecards = <Timecard[]> data.timecards ? data.timecards : []
      this.totalBalance = data.balance
    })
  }

  displayEmployee(employee: Employee) {
    return employee.name
  }

  compareMonth(month1: Month, month2: Month) {
    return month1.id == month2.id
  }

  comparePlace(var1: TimecardPlace, var2: TimecardPlace) {
    return var1.id == var2.id
  }

}
