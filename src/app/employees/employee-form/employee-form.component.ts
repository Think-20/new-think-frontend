import { Component, OnInit, Injectable, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
import { trigger, style, state, transition, animate, keyframes } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Employee } from '../employee.model';
import { EmployeeService } from '../employee.service';
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

@Component({
  selector: 'cb-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css'],
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
export class EmployeeFormComponent implements OnInit {

  path: string = API + '/assets/images/'
  @Input('typeForm') typeForm: string
  @Input('withHeader') withHeader: boolean = true
  @Output('employeeEmitter') employeeEmitter: EventEmitter<Employee> = new EventEmitter()
  @Output('isAdminEmitter') isAdminEmitter: EventEmitter<boolean> = new EventEmitter()

  rowAppearedState = 'ready'
  employee: Employee
  departments: Department[]
  positions: Position[]
  employeeForm: FormGroup
  contactsArray: FormArray
  progress: number
  isAdmin: boolean = false
  imagePath: string

  constructor(
    private employeeService: EmployeeService,
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
    this.imagePath = this.path + 'sem-foto.jpg'

    this.isAdmin = this.authService.hasAccess('employee/save')
    this.isAdminEmitter.emit(this.isAdmin)

    this.employeeForm = this.formBuilder.group({
      name: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]),
      image: this.formBuilder.control('sem-foto.jpg'),
      payment: this.formBuilder.control({ value: '0.00', disabled: !this.isAdmin }, [
        Validators.required
      ]),
      department: this.formBuilder.control({ value: '', disabled: !this.isAdmin }, [
        Validators.required
      ]),
      position: this.formBuilder.control({ value: '', disabled: !this.isAdmin }, [
        Validators.required
      ]),
      schedule_active: this.formBuilder.control({ value: '1', disabled: !this.isAdmin }),
    })

    if (this.typeForm === 'edit' || this.typeForm === 'profile') {
      this.loadEmployee()
    }

    this.loadData()
    this.listenImage()
  }

  listenImage() {
    this.employeeForm.controls.image.valueChanges.subscribe((value) => {
      this.imagePath = this.path + value
    })
  }

  loadData() {
    this.departmentService.departments().subscribe((dataInfo) => {
      this.departments = <Department[]>dataInfo.pagination.data
    })
    this.positionService.positions().subscribe((dataInfo) => {
      this.positions = <Position[]>dataInfo.pagination.data
    })
  }

  loadEmployee() {
    let snackBarStateCharging = this.snackBar.open('Carregando funcionário...')
    let employeeId = this.typeForm == 'edit' ? parseInt(this.route.snapshot.url[1].path) : this.authService.currentUser().employee_id
    this.employeeService.employee(employeeId).subscribe(employee => {
      snackBarStateCharging.dismiss()
      this.employee = employee
      this.employeeEmitter.emit(employee)
      let payment = this.employee.payment != null ? this.employee.payment : 0.00

      this.employeeForm.controls.name.setValue(this.employee.name)
      this.employeeForm.controls.payment.setValue(payment)
      this.employeeForm.controls.department.setValue(this.employee.department)
      this.employeeForm.controls.position.setValue(this.employee.position)
      this.employeeForm.controls.schedule_active.setValue(this.employee.schedule_active)
      this.employeeForm.controls.image.setValue(this.employee.image)
    })
  }

  uploadFile(inputFile: HTMLInputElement) {
    let snackbar = this.snackBar.open('Aguarde enquanto carregamos os arquivos...')
    const path = API + '/assets/images/temp/'

    this.uploadFileService.uploadFile(inputFile, (percentDone) => {
      this.progress = percentDone
    }, (response) => {
      let filename = inputFile.files[0].name
      this.employeeForm.controls.image.setValue(filename)
      this.imagePath = this.path + 'temp/' + filename
      snackbar.dismiss()
    }).subscribe((data) => {})
  }

  compareDepartment(var1: Department, var2: Department) {
    return var1.id === var2.id
  }

  comparePosition(var1: Position, var2: Position) {
    return var1.id === var2.id
  }

  save(employee: Employee) {
    if (ErrorHandler.formIsInvalid(this.employeeForm)) {
      this.snackBar.open('Por favor, preencha corretamente os campos.', '', {
        duration: 5000
      })
      return;
    }

    this.employeeService.save(employee).subscribe(data => {
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

  edit(employee: Employee, employeeId: number) {
    if (ErrorHandler.formIsInvalid(this.employeeForm)) {
      this.snackBar.open('Por favor, preencha corretamente os campos.', '', {
        duration: 5000
      })
      return;
    }

    let url = this.typeForm === 'profile' || this.authService.currentUser().employee_id == employeeId ? '/login' : '/employees'
    employee.id = employeeId

    this.employeeService.edit(employee).subscribe(data => {
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

