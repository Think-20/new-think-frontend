import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

import { Employee } from '../../employees/employee.model';
import { FunctionalityService } from '../../functionalities/functionality.service';
import { DisplayService } from '../../displays/display.service';
import { User } from '../user.model';
import { AuthService } from '../../login/auth.service';
import { UserService } from '../user.service';
import { ErrorHandler } from '../../shared/error-handler.service';
import { Display } from '../../displays/display.model';
import { Functionality } from '../../functionalities/functionality.model';
import { EmployeeService } from '../../employees/employee.service';
import { isNumber } from 'util';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cb-user-permission',
  templateUrl: './user-permission.component.html',
  styleUrls: ['./user-permission.component.css']
})
export class UserPermissionComponent implements OnInit {

  employees: Employee[] = []
  displays: Display[] = []
  functionalities: Functionality[] = []
  userPermissionForm: FormGroup
  @Input('typeForm') typeForm: string
  @Input('employee') employee: Employee

  constructor(
    private functionalityService: FunctionalityService,
    private displayService: DisplayService,
    private employeeService: EmployeeService,
    private userService: UserService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private location: Location,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.userPermissionForm = this.formBuilder.group({
      employee: this.formBuilder.control(''),
      functionalities: this.formBuilder.array([]),
      displays: this.formBuilder.array([]),
    })
    this.load();
    this.employeeService.employees({
      paginate: false
    }).subscribe((dataInfo) => {
      this.employees = <Employee[]> dataInfo.pagination.data
    })
  }

  load() {
    this.displayService.displays({
      paginate: false
    }).subscribe((dataInfo) => {
      let displays = <Display[]> dataInfo.pagination.data
      let displaysForm = <FormArray> this.userPermissionForm.controls.displays

      displays.map((f) => {
        displaysForm.push( new FormControl(this.checkDisplay(f) ))
      })

      this.displays = displays
    })

    this.functionalityService.functionalities({
      paginate: false
    }).subscribe((dataInfo) => {
      let functionalities = <Functionality[]> dataInfo.pagination.data
      let functionalitiesForm = <FormArray> this.userPermissionForm.controls.functionalities

      functionalities.map((f) => {
        functionalitiesForm.push( new FormControl(this.checkFunctionality(f) ))
      })

      this.functionalities = functionalities
    })
  }

  checkDisplay(display: Display) {
    return this.employee.user.displays.find(d => d.id == display.id)
  }

  checkFunctionality(functionality: Functionality) {
    return this.employee.user.functionalities.find(f => f.id == functionality.id)
  }

  edit() {
    if (ErrorHandler.formIsInvalid(this.userPermissionForm)) {
      this.snackBar.open('Por favor, preencha corretamente os campos.', '', {
        duration: 5000
      })
      return;
    }

    let data: {
      userId: number, displays: Array<number>,
      functionalities: Array<number>, id: number,  } = {
        id: null,
        userId: null,
        displays: null,
        functionalities: null
    }

    let employee = this.userPermissionForm.controls.employee.value

    data.id = this.employee.user.id
    data.userId = employee != '' ? employee.user.id : null

    data.displays = this.userPermissionForm.value.displays.map((value, index) => {
      return value ? this.displays[index].id : null
    }).filter((value, index) => {
      return value != null
    })
    data.functionalities = this.userPermissionForm.value.functionalities.map((value, index) => {
      return value ? this.functionalities[index].id : null
    }).filter((value, index) => {
      return value != null
    })

    let url = this.authService.currentUser().id == this.employee.user_id ? '/login' : '/employees'

    this.userService.editPermission(data).subscribe(data => {
      if (data.status) {
        this.snackBar.open('Salvo com sucesso', '', {
          duration: data.status ? 1000 : 5000
        })
        this.loadEmployee();
      } else {
        this.snackBar.open(data.message, '', {
          duration: data.status ? 1000 : 5000
        })
      }
    })
  }

  loadEmployee() {
    let snackBarStateCharging = this.snackBar.open('Carregando...')
    let employeeId = this.typeForm == 'edit' ? parseInt(this.route.snapshot.url[1].path) : this.authService.currentUser().employee_id
    this.employeeService.employee(employeeId).subscribe(employee => {
      snackBarStateCharging.dismiss()
      this.employee = employee
      this.ngOnInit();
    })
  }
}
