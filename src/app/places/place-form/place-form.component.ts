import { Component, OnInit, Injectable, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
import { trigger, style, state, transition, animate, keyframes } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Place } from '../place.model';
import { PlaceService } from '../place.service';

import { CityService } from '../../address/city.service';
import { StateService } from '../../address/state.service';
import { Employee } from '../../employees/employee.model';
import { City } from '../../address/city.model';
import { State } from '../../address/state.model';

import { ErrorHandler } from '../../shared/error-handler.service';
import { Patterns } from '../../shared/patterns.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import { ObjectValidator } from '../../shared/custom-validators';
import { Location } from '@angular/common';

@Component({
  selector: 'cb-place-form',
  templateUrl: './place-form.component.html',
  styleUrls: ['./place-form.component.css'],
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
export class PlaceFormComponent implements OnInit {

  @Input('mode') typeForm: string
  @Input('withHeader') withHeader: boolean = true
  rowAppearedState = 'ready'
  place: Place
  cities: Observable<City[]>
  states: Observable<State[]>
  placeForm: FormGroup

constructor(
    private stateService: StateService,
    private cityService: CityService,
    private placeService: PlaceService,
    private location: Location,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    let snackBarStateCharging
    this.typeForm = this.route.snapshot.url[0].path

    let stateControl: FormControl = this.formBuilder.control('', [Validators.required, ObjectValidator])
    let cityControl: FormControl = this.formBuilder.control('', [Validators.required, ObjectValidator])

    this.placeForm = this.formBuilder.group({
      name: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]),
      street: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]),
      number: this.formBuilder.control('', [
        Validators.maxLength(11)
      ]),
      neighborhood: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ]),
      complement: this.formBuilder.control('', [
        Validators.maxLength(255)
      ]),
      cep: this.formBuilder.control('', [
        Validators.required
      ]),
      city: cityControl,
      state: stateControl
    })

    if(['edit', 'show'].indexOf(this.typeForm) > -1) {
      this.loadPlace()
    }

    stateControl.valueChanges
      .do(stateName => {
         snackBarStateCharging = this.snackBar.open('Aguarde...')
      })
      .debounceTime(500)
      .subscribe(stateName => {
        this.states = this.stateService.states(stateName)
        Observable.timer(500).subscribe(timer => snackBarStateCharging.dismiss())
      })

    cityControl.valueChanges
      .do(stateName => {
         snackBarStateCharging = this.snackBar.open('Aguarde...')
      })
      .debounceTime(500)
      .subscribe(cityName => {
        let stateId = stateControl.value.id || stateControl.value
        this.cities = this.cityService.cities(stateId, cityName)
        Observable.timer(500).subscribe(timer => snackBarStateCharging.dismiss())
      })
  }


  loadPlace() {
    let snackBarStateCharging = this.snackBar.open('Carregando local...')
    let placeId = parseInt(this.route.snapshot.url[1].path)
    this.placeService.place(placeId).subscribe(place => {
      snackBarStateCharging.dismiss()
      this.place = place

      this.placeForm.controls.name.setValue(this.place.name)
      this.placeForm.controls.cep.setValue(this.place.cep)
      this.placeForm.controls.street.setValue(this.place.street)
      this.placeForm.controls.number.setValue(this.place.number)
      this.placeForm.controls.neighborhood.setValue(this.place.neighborhood)
      this.placeForm.controls.city.setValue(this.place.city)
      this.placeForm.controls.state.setValue(this.place.city.state)
      this.placeForm.controls.complement.setValue(this.place.complement)

      if(this.typeForm == 'show') {
        this.placeForm.disable()
      }
    })
  }

  displayState(state: State) {
    return state.code
  }

  displayCity(city: City) {
    return city.name
  }

  save(place: Place) {
    if(ErrorHandler.formIsInvalid(this.placeForm)) {
      this.snackBar.open('Por favor, preencha corretamente os campos.', '', {
        duration: 5000
      })
      return;
    }

    this.placeService.save(place).subscribe(data => {
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

  edit(place: Place, placeId: number) {
    if(ErrorHandler.formIsInvalid(this.placeForm)) {
      this.snackBar.open('Por favor, preencha corretamente os campos.', '', {
        duration: 5000
      })
      return;
    }

    place.id = placeId

    this.placeService.edit(place).subscribe(data => {
      if(data.status) {
        this.router.navigateByUrl('/places')
      } else {
        this.snackBar.open(data.message, '', {
          duration: data.status ? 1000 : 5000
        })
      }
    })
  }
}

