import { Component, OnInit, Injectable, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
import { trigger, style, state, transition, animate, keyframes } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { User } from '../user.model';
import { UserService } from '../user.service';
import { AuthService } from '../../login/auth.service';

import { ErrorHandler } from '../../shared/error-handler.service';
import { Patterns } from '../../shared/patterns.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import { Location } from '@angular/common';
import { Department } from '../../department/department.model';
import { DepartmentService } from '../../department/department.service';
import { PositionService } from '../../position/position.service';
import { Position } from '../../position/position.model';
import { UploadFileService } from '../../shared/upload-file.service';
import { API } from '../../app.api';
import { Employee } from '../../employees/employee.model';

@Component({
  selector: 'cb-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
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
export class UserFormComponent implements OnInit {

  path: string = API + '/assets/images/'
  @Input('typeForm') typeForm: string
  @Input('employee') employee: Employee
  rowAppearedState = 'ready'
  user: User
  departments: Department[]
  positions: Position[]
  userForm: FormGroup
  contactsArray: FormArray
  progress: number
  imagePath: string

  constructor(
    private userService: UserService,
    private departmentService: DepartmentService,
    private positionService: PositionService,
    private uploadFileService: UploadFileService,
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
    this.user = this.employee.user
    this.imagePath = this.path + 'sem-foto.jpg'

    this.userForm = this.formBuilder.group({
      email: this.formBuilder.control(this.user ? this.user.email : '', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ]),
      password: this.formBuilder.control(this.user ? this.user.password : '', [
        Validators.required,
      ]),
    })
  }

  save(user: User) {
    if (ErrorHandler.formIsInvalid(this.userForm)) {
      this.snackBar.open('Por favor, preencha corretamente os campos.', '', {
        duration: 5000
      })
      return;
    }

    this.userService.save(user).subscribe(data => {
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

  edit(user: User, userId: number) {
    if (ErrorHandler.formIsInvalid(this.userForm)) {
      this.snackBar.open('Por favor, preencha corretamente os campos.', '', {
        duration: 5000
      })
      return;
    }

    let url = this.authService.currentUser().id == userId ? '/login' : '/employees'
    user.id = userId

    this.userService.edit(user).subscribe(data => {
      if (data.status) {
        this.router.navigateByUrl(url)
      } else {
        this.snackBar.open(data.message, '', {
          duration: data.status ? 1000 : 5000
        })
      }
    })
  }
}

