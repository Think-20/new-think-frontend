import { Component, OnInit, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
import { trigger, style, state, transition, animate, keyframes } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Provider } from '../provider.model';
import { ProviderService } from '../provider.service';

import { PersonTypeService } from '../../person-types/person-type.service';
import { CityService } from '../../address/city.service';
import { StateService } from '../../address/state.service';
import { EmployeeService } from '../../employees/employee.service';
import { AuthService } from '../../login/auth.service';
import { BankAccountTypeService } from '../../bank-account-types/bank-account-type.service';
import { BankService } from '../../banks/bank.service';

import { Employee } from '../../employees/employee.model';
import { PersonType } from '../../person-types/person-type.model';
import { City } from '../../address/city.model';
import { State } from '../../address/state.model';
import { Contact } from '../../contacts/contact.model';
import { BankAccount } from '../../bank-accounts/bank-account.model';
import { BankAccountType } from '../../bank-account-types/bank-account-type.model';
import { Bank } from '../../banks/bank.model';

import { ErrorHandler } from '../../shared/error-handler.service';
import { Patterns } from '../../shared/patterns.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';

@Component({
  selector: 'cb-provider-form',
  templateUrl: './provider-form.component.html',
  styleUrls: ['./provider-form.component.css'],
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
export class ProviderFormComponent implements OnInit {

  typeForm: string
  rowAppearedState = 'ready'
  provider: Provider
  banks: Observable<Bank[]>
  bankAccountTypes: Observable<BankAccountType[]>
  cities: Observable<City[]>
  states: Observable<State[]>
  employees: Employee[]
  personTypes: PersonType[]
  providerForm: FormGroup

  constructor(
    private stateService: StateService,
    private cityService: CityService,
    private bankAccountTypeService: BankAccountTypeService,
    private bankService: BankService,
    private personTypeService: PersonTypeService,
    private employeeService: EmployeeService,
    private providerService: ProviderService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    let snackBarStateCharging
    this.typeForm = this.route.snapshot.url[0].path

    let cpfValidators = [
        Validators.required,
        Validators.minLength(11)
    ]
    let cnpjValidators = [
        Validators.required,
        Validators.minLength(14)
    ]
    let stateControl: FormControl = this.formBuilder.control('', [Validators.required])
    let cityControl: FormControl = this.formBuilder.control('', [Validators.required])
    let employeeControl: FormControl = this.formBuilder.control('', [Validators.required])
    let personTypeControl: FormControl = this.formBuilder.control('', [Validators.required])

    this.providerForm = this.formBuilder.group({
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
      person_type: personTypeControl,
      employee: employeeControl,
      rate: this.formBuilder.control(''),
      cnpj: this.formBuilder.control('', cnpjValidators),
      cpf: this.formBuilder.control('', cpfValidators),
      ie: this.formBuilder.control(''),
      mainphone: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(10)
      ]),
      secundaryphone: this.formBuilder.control('', [
        Validators.minLength(10)
      ]),
      note: this.formBuilder.control(''),
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
      accounts: this.formBuilder.array([]),
      contacts: this.formBuilder.array([])
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

    personTypeControl.valueChanges
      .subscribe(person => {
        if(person.id == 2) {
          this.providerForm.controls.cpf.setValidators([])
          this.providerForm.controls.cpf.updateValueAndValidity()
          this.providerForm.controls.cnpj.setValidators(cnpjValidators)
        } else if(person.id == 1) {
          this.providerForm.controls.cnpj.setValidators([])
          this.providerForm.controls.cnpj.updateValueAndValidity()
          this.providerForm.controls.cpf.setValidators(cpfValidators)
        }
      })

    this.employeeService.employees().subscribe(dataInfo => {
      this.employees = dataInfo.pagination.data
      this.personTypeService.personTypes().subscribe(personTypes => {
        this.personTypes = personTypes
        if(this.typeForm === 'edit') {
            this.loadClient()
          } else {
            this.providerForm.controls.person_type.setValue(this.personTypes.filter((personType) => {
              return personType.id == 2
            }).pop())
            this.providerForm.controls.employee.setValue(this.employees.filter((employee) => {
              return employee.name == this.authService.currentUser().employee.name
            }).pop())
            this.addContact()
            this.addAccount()
        }
      })
    })

    this.bankAccountTypes = this.bankAccountTypeService.bankAccountTypes()
    this.banks = this.bankService.banks()
  }

  loadClient() {
    let snackBarStateCharging = this.snackBar.open('Carregando fornecedor...')
    let providerId = parseInt(this.route.snapshot.url[1].path)
    this.providerService.provider(providerId).subscribe(provider => {
      snackBarStateCharging.dismiss()
      this.provider = provider

      this.providerForm.controls.name.setValue(this.provider.name)
      this.providerForm.controls.fantasy_name.setValue(this.provider.fantasy_name)
      this.providerForm.controls.cnpj.setValue(this.provider.cnpj)
      this.providerForm.controls.cpf.setValue(this.provider.cpf)
      this.providerForm.controls.mainphone.setValue(this.provider.mainphone)
      this.providerForm.controls.secundaryphone.setValue(this.provider.secundaryphone)
      this.providerForm.controls.person_type.setValue(this.provider.person_type)
      this.providerForm.controls.employee.setValue(this.provider.employee)
      this.providerForm.controls.site.setValue(this.provider.site)
      this.providerForm.controls.note.setValue(this.provider.note)
      this.providerForm.controls.rate.setValue(this.provider.rate)
      this.providerForm.controls.cep.setValue(this.provider.cep)
      this.providerForm.controls.street.setValue(this.provider.street)
      this.providerForm.controls.number.setValue(this.provider.number)
      this.providerForm.controls.neighborhood.setValue(this.provider.neighborhood)
      this.providerForm.controls.city.setValue(this.provider.city)
      this.providerForm.controls.state.setValue(this.provider.city.state)
      this.providerForm.controls.complement.setValue(this.provider.complement)

      this.providerForm.controls.contacts.setValue([])

      for(let contact of provider.contacts) {
        this.addContact(contact)
      }

      for(let account of provider.accounts) {
        this.addAccount(account)
      }
    })
  }

  get contacts() { return this.providerForm.get('contacts'); }

  get accounts() { return this.providerForm.get('accounts'); }

  compareBankAccountType(o1: BankAccountType, o2: BankAccountType) {
    return o1.id === o2.id
  }

  compareBank(o1: Bank, o2: Bank) {
    return o1.id === o2.id
  }

  compareEmployee(employee1: Employee, employee2: Employee) {
    return employee1.id === employee2.id
  }

  comparePersonType(personType1: PersonType, personType2: PersonType) {
    return personType1.id === personType2.id
  }

  addContact(contact?: Contact) {
    const contacts = <FormArray>this.providerForm.controls['contacts']

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
    const contacts = <FormArray>this.providerForm.controls['contacts']
    if(contacts.length > 1) contacts.removeAt(i)
  }

  addAccount(account?: BankAccount) {
    const accounts = <FormArray>this.providerForm.controls['accounts']

    accounts.push(this.formBuilder.group({
      id: this.formBuilder.control(account ? account.id : '' || ''),
      favored: this.formBuilder.control(account ? account.favored : '' || '', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]),
      agency: this.formBuilder.control(account ? account.agency : '' || '', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(6)
      ]),
      account_number: this.formBuilder.control(account ? account.account_number : '', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ]),
      bank_account_type: this.formBuilder.control(account ? account.bank_account_type : '' || '', [
        Validators.required
      ]),
      bank: this.formBuilder.control(account ? account.bank : '' || '', [
        Validators.required
      ])
    }))
  }

  deleteAccount(i) {
    const accounts = <FormArray>this.providerForm.controls['accounts']
    accounts.removeAt(i)
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

  getContactsControls(providerForm: FormGroup) {
    return (<FormArray>this.providerForm.get('contacts')).controls
  }

  getAccountsControls(providerForm: FormGroup) {
    return (<FormArray>this.providerForm.get('accounts')).controls
  }

  save(provider: Provider) {
    if(ErrorHandler.formIsInvalid(this.providerForm)) {
      this.snackBar.open('Por favor, preencha corretamente os campos.', '', {
        duration: 5000
      })
      return;
    }

    this.providerService.save(provider).subscribe(data => {
      this.snackBar.open(data.message, '', {
        duration: 5000
      })
    })
  }

  edit(provider: Provider, providerId: number) {
    if(ErrorHandler.formIsInvalid(this.providerForm)) {
      this.snackBar.open('Por favor, preencha corretamente os campos.', '', {
        duration: 5000
      })
      return;
    }

    provider.id = providerId

    this.providerService.edit(provider).subscribe(data => {
      this.snackBar.open(data.message, '', {
        duration: data.status ? 1000 : 5000
      }).afterDismissed().subscribe(observer => {
        this.loadClient()
      })
    })
  }
}

