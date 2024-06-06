import { Bank } from '../banks/bank.model';
import { BankAccountType } from '../bank-account-types/bank-account-type.model';

export class BankAccount {
    id: number
    favored: string
    agency: string
    account_number: number
    bank_account_type?: BankAccountType
    bank?: Bank
}