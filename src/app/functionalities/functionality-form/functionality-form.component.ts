import { Component, OnInit, Injectable, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
import { trigger, style, state, transition, animate, keyframes } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Functionality } from '../functionality.model';
import { FunctionalityService } from '../functionality.service';
import { AuthService } from '../../login/auth.service';

import { ErrorHandler } from '../../shared/error-handler.service';
import { Patterns } from '../../shared/patterns.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import { Location } from '@angular/common';
import { API } from '../../app.api';

@Component({
  selector: 'cb-functionality-form',
  templateUrl: './functionality-form.component.html',
  styleUrls: ['./functionality-form.component.css'],
  animations: [
    trigger('rowAppeared', [
      state('ready', style({ opacity: 1 })),
      transition('void => ready', animate('300ms 0s ease-in', keyframes([
        style({ opacity: 0, transform: 'translateX(-30px)', offset: 0 }),
        style({ opacity: 0.8, transform: 'translateX(10px)', offset: 0.8 }),
        style({ opacity: 1, transform: 'translateX(0px)', offset: 1 })
      ]))),
      transition('ready => void', animate('300ms 0s ease-out', keyframes([
        style({ opacity: 1, transform: 'translateX(0px)', offset: 0 }),
        style({ opacity: 0.8, transform: 'translateX(-10px)', offset: 0.2 }),
        style({ opacity: 0, transform: 'translateX(30px)', offset: 1 })
      ]))),
    ])
  ]
})
@Injectable()
export class FunctionalityFormComponent implements OnInit {

  path: string = API + '/assets/images/'
  @Input('typeForm') typeForm: string
  @Input('withHeader') withHeader: boolean = true
  @Output('functionalityEmitter') functionalityEmitter: EventEmitter<Functionality> = new EventEmitter()
  @Output('isAdminEmitter') isAdminEmitter: EventEmitter<boolean> = new EventEmitter()

  rowAppearedState = 'ready'
  functionality: Functionality
  functionalityForm: FormGroup
  contactsArray: FormArray
  progress: number
  isAdmin: boolean = false

  constructor(
    private functionalityService: FunctionalityService,
    private authService: AuthService,
    private location: Location,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    let snackBarStateCharging
    this.typeForm = this.route.snapshot.url[0].path

    this.isAdmin = this.authService.hasAccess('functionality/save')
    this.isAdminEmitter.emit(this.isAdmin)

    this.functionalityForm = this.formBuilder.group({
      url: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255)
      ]),
      description: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255)
      ]),
    })

    if (this.typeForm === 'edit') {
      this.loadFunctionality()
    }
  }

  loadFunctionality() {
    let snackBarStateCharging = this.snackBar.open('Carregando funcionário...')
    let functionalityId = parseInt(this.route.snapshot.url[1].path)
    this.functionalityService.functionality(functionalityId).subscribe(functionality => {
      snackBarStateCharging.dismiss()
      this.functionality = functionality
      this.functionalityEmitter.emit(functionality)

      this.functionalityForm.controls.url.setValue(this.functionality.url)
      this.functionalityForm.controls.description.setValue(this.functionality.description)
    })
  }

  save(functionality: Functionality) {
    if (ErrorHandler.formIsInvalid(this.functionalityForm)) {
      this.snackBar.open('Por favor, preencha corretamente os campos.', '', {
        duration: 5000
      })
      return;
    }

    this.functionalityService.save(functionality).subscribe(data => {
      let snackbar = this.snackBar.open(data.message, '', {
        duration: 5000
      })

      if (data.status) {
        snackbar.afterDismissed().subscribe(() => {
          this.location.back()
        })
      }
    })
  }

  edit(functionality: Functionality, functionalityId: number) {
    if (ErrorHandler.formIsInvalid(this.functionalityForm)) {
      this.snackBar.open('Por favor, preencha corretamente os campos.', '', {
        duration: 5000
      })
      return;
    }

    functionality.id = functionalityId

    this.functionalityService.edit(functionality).subscribe(data => {
      if (data.status) {
        this.router.navigateByUrl('/functionalities')
      } else {
        this.snackBar.open(data.message, '', {
          duration: data.status ? 1000 : 5000
        })
      }
    })
  }
}

