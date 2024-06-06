import { City } from "../address/city.model";

export class Place {
    id: number
    name: string
    street: string
    number: number
    neighborhood: string
    complement?: string
    city?: City
    cep: number
    created_at: string
    updated_at: string
}
