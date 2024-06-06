import { City } from '../address/city.model';
import { Employee } from '../employees/employee.model';
import { PersonType } from '../person-types/person-type.model';
import { Contact } from '../contacts/contact.model';
import { BankAccount } from '../bank-accounts/bank-account.model';

export class Provider {
    id: number
    name: string
    fantasy_name: string
    cnpj: number
    cpf: number
    mainphone: number
    secundaryphone: number
    site: string
    rate: number
    note: string
    street: string
    number: number
    neighborhood: string
    complement?: string
    city?: City
    cep: number
    employee?: Employee
    person_type?: PersonType
    contacts?: Contact[]
    accounts?: BankAccount[]
    created_at: string
    updated_at: string
}