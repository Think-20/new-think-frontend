export let Patterns = {
    number: new RegExp(/^([0-9]+)$/),
    percent: new RegExp(/^([0-9%]+)$/),
    float: new RegExp(/^([0-9,]+)$/),
    cep: new RegExp(/^([0-9]{5}-[0-9]{3})$/),
    cnpj: new RegExp(/^([0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}-[0-9]{2})$/),
    email: new RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/),
    phone: new RegExp(/^(\([0-9]{2}\)\s[0-9]{4}-[0-9]{4,5})$/)
}
