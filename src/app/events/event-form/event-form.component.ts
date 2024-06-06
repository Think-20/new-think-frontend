import { Component, OnInit, Injectable, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { trigger, style, state, transition, animate, keyframes } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Event } from '../event.model';
import { EventService } from '../event.service';
import { AuthService } from '../../login/auth.service';

import { ErrorHandler } from '../../shared/error-handler.service';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import { ObjectValidator } from '../../shared/custom-validators';
import { Location } from '@angular/common';
import { Place } from '../../places/place.model';
import { PlaceService } from '../../places/place.service';
import { isObject } from 'util';
import { Patterns } from 'app/shared/patterns.model';
import { UploadFileService } from 'app/shared/upload-file.service';
import { JobService } from '../../jobs/job.service';

@Component({
  selector: 'cb-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css'],
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
      ]))),
    ])
  ]
})
@Injectable()
export class EventFormComponent implements OnInit {

  @Input('mode') typeForm: string
  @Input('withHeader') withHeader: boolean = true
  rowAppearedState = 'ready'
  event: Event
  places: Place[]
  eventForm: FormGroup
  contactsArray: FormArray

constructor(
    private placeService: PlaceService,
    private eventService: EventService,
    private jobService: JobService,
    private uploadFileService: UploadFileService,
    private authService: AuthService,
    private location: Location,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.typeForm = this.route.snapshot.url[0].path

    this.eventForm = this.formBuilder.group({
      name: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]),
      edition: this.formBuilder.control('', [
        Validators.maxLength(20)
      ]),
      note: this.formBuilder.control('', [
        Validators.minLength(3),
        Validators.maxLength(1000)
      ]),
      place: this.formBuilder.control('', [
        Validators.required,
        ObjectValidator
      ]),
      ini_date: this.formBuilder.control('', [
        Validators.required
      ]),
      fin_date: this.formBuilder.control('', [
        Validators.required
      ]),
      ini_hour: this.formBuilder.control('', [
        Validators.required
      ]),
      fin_hour: this.formBuilder.control('', [
        Validators.required
      ]),
      ini_date_mounting: this.formBuilder.control('', [
        Validators.required
      ]),
      fin_date_mounting: this.formBuilder.control('', [
        Validators.required
      ]),
      ini_hour_mounting: this.formBuilder.control('', [
        Validators.required
      ]),
      fin_hour_mounting: this.formBuilder.control('', [
        Validators.required
      ]),
      ini_date_unmounting: this.formBuilder.control('', [
        Validators.required
      ]),
      fin_date_unmounting: this.formBuilder.control('', [
        Validators.required
      ]),
      ini_hour_unmounting: this.formBuilder.control('', [
        Validators.required
      ]),
      fin_hour_unmounting: this.formBuilder.control('', [
        Validators.required
      ]),
      organizer: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]),
      email: this.formBuilder.control('', [
        Validators.required,
        Validators.pattern(Patterns.email),
        Validators.maxLength(80)
      ]),
      phone: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern(Patterns.phone)
      ]),
      site: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(100)
      ]),
      plan: this.formBuilder.control('', [
        Validators.required
      ]),
      regulation: this.formBuilder.control('', [
        Validators.required
      ]),
      manual: this.formBuilder.control('', [
        Validators.required
      ]),
      created_at: this.formBuilder.control(''),
      updated_at: this.formBuilder.control(''),
      employee: this.formBuilder.control(''),
    })

    this.listenPlaces()

    if(['edit', 'show'].indexOf(this.typeForm) > -1) {
      this.loadEvent()
    }
  }

  listenPlaces() {
    let snackBarStateCharging
    this.eventForm.controls.place.valueChanges.subscribe((value) => {
      if( isObject(value) ) return false

      snackBarStateCharging = this.snackBar.open('Aguarde...')
      this.placeService.places({ search: value })
        .do(value => {
          snackBarStateCharging.dismiss()
        })
        .debounceTime(500)
        .subscribe((dataInfo) => {
          this.places = <Place[]> dataInfo.pagination.data
        })
    })
  }

  uploadFile(field: string, inputFile: HTMLInputElement) {
    let file: File = inputFile.files[0]
    this.eventForm.controls[field].setValue('Carregando arquivo...')

    this.uploadFileService.uploadFile(inputFile,
    (percentDone) => {
      this.eventForm.controls[field].setValue('Carregando ' + percentDone + '%')
    },
    (response) => {
      this.eventForm.controls[field].setValue(file.name)
    }).subscribe()
  }

  previewFile(filename: string, type: string) {
    if(this.typeForm != 'show') return

    this.eventService.previewFile(this.event, type, filename)
  }

  loadEvent() {
    let snackBarStateCharging = this.snackBar.open('Carregando evento...')
    let eventId = parseInt(this.route.snapshot.url[1].path)
    this.eventService.event(eventId).subscribe(event => {
      snackBarStateCharging.dismiss()
      this.event = event

      this.eventForm.controls.name.setValue(this.event.name)
      this.eventForm.controls.edition.setValue(this.event.edition)
      this.eventForm.controls.note.setValue(this.event.note)
      this.eventForm.controls.place.setValue(this.event.place)

      this.eventForm.controls.ini_date.setValue(new Date(this.event.ini_date + "T00:00:00"))
      this.eventForm.controls.fin_date.setValue(new Date(this.event.fin_date + "T00:00:00"))
      this.eventForm.controls.ini_hour.setValue(this.event.ini_hour)
      this.eventForm.controls.fin_hour.setValue(this.event.fin_hour)

      this.eventForm.controls.ini_date_mounting.setValue(new Date(this.event.ini_date_mounting + "T00:00:00"))
      this.eventForm.controls.fin_date_mounting.setValue(new Date(this.event.fin_date_mounting + "T00:00:00"))
      this.eventForm.controls.ini_hour_mounting.setValue(this.event.ini_hour_mounting)
      this.eventForm.controls.fin_hour_mounting.setValue(this.event.fin_hour_mounting)

      this.eventForm.controls.ini_date_unmounting.setValue(new Date(this.event.ini_date_unmounting + "T00:00:00"))
      this.eventForm.controls.fin_date_unmounting.setValue(new Date(this.event.fin_date_unmounting + "T00:00:00"))
      this.eventForm.controls.ini_hour_unmounting.setValue(this.event.ini_hour_unmounting)
      this.eventForm.controls.fin_hour_unmounting.setValue(this.event.fin_hour_unmounting)

      this.eventForm.controls.created_at.setValue(new Date(this.event.created_at))
      this.eventForm.controls.updated_at.setValue(new Date(this.event.updated_at))
      this.eventForm.controls.employee.setValue(this.event.employee.name)

      this.eventForm.controls.organizer.setValue(this.event.organizer)
      this.eventForm.controls.site.setValue(this.event.site)
      this.eventForm.controls.phone.setValue(this.event.phone)
      this.eventForm.controls.email.setValue(this.event.email)

      this.eventForm.controls.plan.setValue(this.event.plan)
      this.eventForm.controls.regulation.setValue(this.event.regulation)
      this.eventForm.controls.manual.setValue(this.event.manual)

      if(this.typeForm == 'show') {
        this.eventForm.disable()
      }
    })
  }

  displayPlace(place: Place) {
    return place.name
  }

  save(event: Event) {
    if(ErrorHandler.formIsInvalid(this.eventForm)) {
      this.snackBar.open('Por favor, preencha corretamente os campos.', '', {
        duration: 5000
      })
      return;
    }

    this.eventService.save(event).subscribe(data => {
      let snackbar = this.snackBar.open(data.message, '', {
        duration: 5000
      })

      if(data.status) {
        snackbar.afterDismissed().subscribe(() => {
          this.location.back()
        })
      }
    })
  }

  edit(event: Event, eventId: number) {
    if(ErrorHandler.formIsInvalid(this.eventForm)) {
      this.snackBar.open('Por favor, preencha corretamente os campos.', '', {
        duration: 5000
      })
      return;
    }

    event.id = eventId

    this.eventService.edit(event).subscribe(data => {
      if(data.status) {
        this.router.navigateByUrl('/events')
      } else {
        this.snackBar.open(data.message, '', {
          duration: data.status ? 1000 : 5000
        })
      }
    })
  }
}

