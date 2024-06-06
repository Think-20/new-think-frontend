import { Component, OnInit, Injectable, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
import { trigger, style, state, transition, animate, keyframes } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Client } from '../client.model';
import { ClientService } from '../client.service';

import { CityService } from '../../address/city.service';
import { StateService } from '../../address/state.service';
import { ClientTypeService } from '../client-types/client-type.service';
import { ClientStatusService } from '../client-status/client-status.service';
import { EmployeeService } from '../../employees/employee.service';
import { AuthService } from '../../login/auth.service';
import { Employee } from '../../employees/employee.model';
import { City } from '../../address/city.model';
import { State } from '../../address/state.model';
import { ClientType } from '../client-types/client-type.model';
import { ClientStatus } from '../client-status/client-status.model';
import { Contact } from '../../contacts/contact.model';

import { ErrorHandler } from '../../shared/error-handler.service';
import { Patterns } from '../../shared/patterns.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import { ClientComission } from '../client-comission/client-comission.model';
import { ClientComissionService } from '../client-comission/client-comission.service';
import { ObjectValidator, CnpjValidator } from '../../shared/custom-validators';
import { Location } from '@angular/common';

@Component({
  selector: 'cb-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css'],
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
export class ClientFormComponent implements OnInit {

  @Input('mode') typeForm: string
  @Input('withHeader') withHeader: boolean = true
  rowAppearedState = 'ready'
  client: Client
  clientTypes: ClientType[]
  comissions: ClientComission[]
  clientStatus: ClientStatus[]
  cities: Observable<City[]>
  states: Observable<State[]>
  employees: Employee[]
  clientForm: FormGroup
  contactsArray: FormArray

constructor(
    private stateService: StateService,
    private cityService: CityService,
    private clientTypeService: ClientTypeService,
    private clientComissionService: ClientComissionService,
    private clientStatusService: ClientStatusService,
    private employeeService: EmployeeService,
    private clientService: ClientService,
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

    let stateControl: FormControl = this.formBuilder.control('', [Validators.required, ObjectValidator])
    let cityControl: FormControl = this.formBuilder.control('', [Validators.required, ObjectValidator])
    let clientTypeControl: FormControl = this.formBuilder.control('', [Validators.required])
    let comissionControl: FormControl = this.formBuilder.control('', [Validators.required])
    let clientStatusControl: FormControl = this.formBuilder.control('', [Validators.required])
    let employeeControl: FormControl = this.formBuilder.control('', [Validators.required])

    this.clientForm = this.formBuilder.group({
      name: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]),
      fantasy_name: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]),
      site: this.formBuilder.control('', [
        Validators.minLength(7),
      ]),
      client_type: clientTypeControl,
      comission: comissionControl,
      client_status: clientStatusControl,
      employee: employeeControl,
      rate: this.formBuilder.control(''),
      cnpj: this.formBuilder.control('', [
        Validators.required,
        CnpjValidator
      ]),
      ie: this.formBuilder.control(''),
      mainphone: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(10)
      ]),
      secundaryphone: this.formBuilder.control('', [
        Validators.minLength(10)
      ]),
      note: this.formBuilder.control(''),
      external: this.formBuilder.control(''),
      external_toggle: this.formBuilder.control(''),
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
      state: stateControl,
      contacts: this.formBuilder.array([])
    })

    this.clientForm.controls.external_toggle.valueChanges.subscribe(() => {
      this.toggleExternal()
    })

    // this.employeeService.canInsertClients().subscribe(employees => {
    //   this.employees = employees
    // })

    this.employeeService.employees({
      paginate: false,
      deleted: true
    }).subscribe(dataInfo => {
      let employees = dataInfo.pagination.data
      this.employees = employees.filter(employee => {
        return (employee.department.description === 'Atendimento' || employee.department.description ==='Diretoria')
      })
    })

    this.clientTypeService.types().subscribe((clientTypes) => {
      this.clientTypes = clientTypes

      this.clientComissionService.comission().subscribe((comissions) => {
        this.comissions = comissions
      })

      this.clientStatusService.status().subscribe((clientStatus) => {
        this.clientStatus = clientStatus

        if(this.typeForm === 'edit') {
          this.loadClient()
        } else {
          this.clientForm.controls.client_status.setValue(this.clientStatus.filter((status) => {
            return status.description == 'Ativo'
          }).pop())
          this.clientForm.controls.employee.setValue(this.employees.filter((employee) => {
            return employee.name == this.authService.currentUser().employee.name
          }).pop())
          this.addContact()
        }
      })
    })

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

  toggleExternal() {
    if(this.clientForm.controls.external_toggle.value) {
      this.clientForm.controls.external.setValue(1)
      this.clientForm.controls.cnpj.clearValidators()
      this.clientForm.controls.cnpj.disable()
    } else {
      this.clientForm.controls.external.setValue(0)
      this.clientForm.controls.cnpj.enable()
      this.clientForm.controls.cnpj.setValidators([
        Validators.required,
        CnpjValidator
      ])
      this.clientForm.controls.cnpj.updateValueAndValidity()
    }
  }

  loadClient() {
    let snackBarStateCharging = this.snackBar.open('Carregando cliente...')
    let clientId = parseInt(this.route.snapshot.url[1].path)
    this.clientService.client(clientId).subscribe(client => {
      snackBarStateCharging.dismiss()
      this.client = client

      this.clientForm.controls.name.setValue(this.client.name)
      this.clientForm.controls.fantasy_name.setValue(this.client.fantasy_name)
      this.clientForm.controls.cnpj.setValue(this.client.cnpj)
      this.clientForm.controls.external_toggle.setValue(this.client.external == 1 ? true : false)
      this.clientForm.controls.mainphone.setValue(this.client.mainphone)
      this.clientForm.controls.secundaryphone.setValue(this.client.secundaryphone)
      this.clientForm.controls.client_type.setValue(this.client.type)
      this.clientForm.controls.comission.setValue(this.client.comission)
      this.clientForm.controls.client_status.setValue(this.client.status)
      this.clientForm.controls.employee.setValue(this.client.employee)
      this.clientForm.controls.site.setValue(this.client.site)
      this.clientForm.controls.note.setValue(this.client.note)
      this.clientForm.controls.rate.setValue(this.client.rate)
      this.clientForm.controls.cep.setValue(this.client.cep)
      this.clientForm.controls.street.setValue(this.client.street)
      this.clientForm.controls.number.setValue(this.client.number)
      this.clientForm.controls.neighborhood.setValue(this.client.neighborhood)
      this.clientForm.controls.city.setValue(this.client.city)
      this.clientForm.controls.state.setValue(this.client.city.state)
      this.clientForm.controls.complement.setValue(this.client.complement)

      this.clientForm.controls.contacts.setValue([])

      for(let contact of client.contacts) {
        this.addContact(contact)
      }
    })
  }

  get contacts() { return this.clientForm.get('contacts'); }

  compareClientType(clientType1: ClientType, clientType2: ClientType) {
    return clientType1.id === clientType2.id
  }

  compareComission(var1: ClientComission, var2: ClientComission) {
    return var1.id === var2.id
  }

  compareClientStatus(clientStatus1: ClientStatus, clientStatus2: ClientStatus) {
    return clientStatus1.id === clientStatus2.id
  }

  compareEmployee(employee1: Employee, employee2: Employee) {
    return employee1.id === employee2.id
  }

  addContact(contact?: Contact) {
    const contacts = <FormArray>this.clientForm.controls['contacts']

    contacts.push(this.formBuilder.group({
      id: this.formBuilder.control(contact ? contact.id : '' || ''),
      name: this.formBuilder.control(contact ? contact.name : '' || '', [
        Validators.required,
        Validators.minLength(3)
      ]),
      department: this.formBuilder.control(contact ? contact.department : '' || '', [
        Validators.required,
        Validators.minLength(3)
      ]),
      email: this.formBuilder.control(contact ? contact.email : '', [
        Validators.required,
        Validators.pattern(Patterns.email),
        Validators.maxLength(80)
      ]),
      cellphone: this.formBuilder.control(contact ? contact.cellphone : '' || '', [
        Validators.minLength(10),
        Validators.pattern(Patterns.phone)
      ])
    }))
  }

  deleteContact(i) {
    const contacts = <FormArray>this.clientForm.controls['contacts']
    if(contacts.length > 1) contacts.removeAt(i)
  }

  displayState(state: State) {
    return state.code
  }

  displayEmployee(employee: Employee) {
    return employee.name
  }

  displayCity(city: City) {
    return city.name
  }

  getContactsControls(clientForm: FormGroup) {
    return (<FormArray>this.clientForm.get('contacts')).controls
  }

  save(client: Client) {
    if(ErrorHandler.formIsInvalid(this.clientForm)) {
      this.snackBar.open('Por favor, preencha corretamente os campos.', '', {
        duration: 5000
      })
      return;
    }

    this.clientService.save(client).subscribe(data => {
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

  edit(client: Client, clientId: number) {
    if(ErrorHandler.formIsInvalid(this.clientForm)) {
      this.snackBar.open('Por favor, preencha corretamente os campos.', '', {
        duration: 5000
      })
      return;
    }

    client.id = clientId

    this.clientService.edit(client).subscribe(data => {
      if(data.status) {
        this.router.navigateByUrl('/clients')
      } else {
        this.snackBar.open(data.message, '', {
          duration: data.status ? 1000 : 5000
        })
      }
    })
  }
}

