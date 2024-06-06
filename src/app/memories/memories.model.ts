export interface Memory {
    jobs: Job[];
    clients: Client[];
    jobs_approveds: Job[];
}
  
export interface Job {
    id: number;
    client: Client;
    agency: Agency;
    event: string;
    budget_value: number;
    attendance: Designer;
    production_responsible: Producer;
    status: Status;
    created_at: Date;
}

export interface Client {
    name: string;
    type: ClientType;
    status: ClientStatus;
    lastJobEvent: string;
    lastJobId: number;
}

export interface Agency {
    name: string;
    fantasy_name: string;
}

export interface Designer {
    name: string;
}

export interface Producer {
    name: string;
}

export interface Status {
    description: string;
}

export interface ClientType {
    description: string;
}

export interface ClientStatus {
    description: string;
}

export interface TableInfo {
    name: string;
    show: boolean;
    previousButton: boolean;
    nextButton: boolean;
}
