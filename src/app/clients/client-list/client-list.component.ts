import { Component, OnInit, Injectable, AfterViewInit } from '@angular/core';
import { EmployeeService } from 'app/employees/employee.service';
import { Employee } from 'app/employees/employee.model';
import { ClientType } from 'app/clients/client-types/client-type.model';
import { ClientTypeService } from 'app/clients/client-types/client-type.service';
import { ClientStatusService } from 'app/clients/client-status/client-status.service';
import { ClientStatus } from 'app/clients/client-status/client-status.model';
import { Client } from 'app/clients/client.model';
import { ClientService } from 'app/clients/client.service';
import { DataInfo } from 'app/shared/data-info.model';
import { StarsComponent } from 'app/shared/stars/stars.component';
import { AuthService } from 'app/login/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdatedInfoComponent } from 'app/shared/list-data/updated-info/updated-info.component';
import { ListData, mF } from 'app/shared/list-data/list-data.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'cb-client-list',
  templateUrl: './client-list.component.html'
})
@Injectable()
export class ClientListComponent implements OnInit {
  listData: ListData;

  constructor(
    private employeeService: EmployeeService,
    private clientTypeService: ClientTypeService,
    private clientStatusService: ClientStatusService,
    private router: Router,
    private snackbar: MatSnackBar,
    private clientService: ClientService,
    private authService: AuthService,
  ) { }

  permissionVerify(module: string, client: Client): boolean {
    let access: boolean
    let employee = this.authService.currentUser().employee
    switch(module) {
      case 'show': {
        access = client.employee.id != employee.id ? this.authService.hasAccess('clients/get/{id}') : true
        break
      }
      case 'edit': {
        access = client.employee.id != employee.id ? this.authService.hasAccess('client/edit') : true
        break
      }
      case 'delete': {
        access = client.employee.id != employee.id ? this.authService.hasAccess('client/remove/{id}') : true
        break
      }
      default: {
        access = false
        break
      }
    }
    return access
  }

  ngOnInit() {
    this.listData = {
      header: {
        getParams: (formValue) => {
          return {
            search: formValue.search,
            attendance_array: formValue.attendance_array,
            client_status: formValue.client_status,
            client_type: formValue.client_type,
            rate: formValue.rate,
          }
        },
        filterFields: [
          mF({
            arrayValues: this.employeeService.employees({paginate: false, deleted: true}).pipe(map(dataInfo => dataInfo.pagination.data.filter(employee => employee.department.description === 'Atendimento' || employee.department.description === 'Diretoria'))).toPromise(),
            class: 'col-md-3',
            formcontrolname: 'attendance_array',
            placeholder: 'Atendimento',
            type: 'select',
            multiple: true,
            optionDescription: 'name',
          }),
          mF({
            arrayValues: this.clientTypeService.types().toPromise(),
            class: 'col-md-3',
            formcontrolname: 'client_type',
            placeholder: 'Tipo',
            type: 'select',
            optionDescription: 'description',
          }),
          mF({
            arrayValues: this.clientStatusService.status().toPromise(),
            class: 'col-md-3',
            formcontrolname: 'client_status',
            placeholder: 'Status',
            type: 'select',
            optionDescription: 'description',
          }),
          mF({
            class: 'col-md-3 star-input',
            formcontrolname: 'rate',
            placeholder: 'Score',
            type: 'stars',
            starsRate: null,
          }),
        ]
      },
      body: {
        dataFields: [
          {
            style: { width: '20%' },
            label: 'Nome',
            showData: (client: Client) => { return client.fantasy_name }
          },
          {
            style: { width: '13%' },
            label: 'Tipo',
            showData: (client: Client) => { return client.type.description }
          },
          {
            style: { width: '12%' },
            label: 'Status',
            showData: (client: Client) => { return client.status.description }
          },
          {
            style: { width: '25%' },
            label: 'Atendimento',
            showData: (client: Client) => { return client.employee.name }
          },
          {
            style: { width: '20%' },
            label: 'Score',
            component: StarsComponent,
            afterCreateComponent: (client: Client, dataInfo: DataInfo, stars: StarsComponent) => {
              stars.rate = client.rate
              stars.readonly = true
            }
          },
        ],
        hasMenuButton: true,
        loadData: (params, page) => {
          return this.clientService.clients(params, page)
        },
        menuItems: [
          {
            icon: 'subject',
            label: 'Detalhes',
            actions: {
              click: (client: Client) => {
                return this.router.navigate(['/clients/show', client.id])
              },
              disabled: (client: Client) => {
                return !this.permissionVerify('show', client)
              }
            }
          },
          {
            icon: 'mode_edit',
            label: 'Editar',
            actions: {
              click: (client: Client) => {
                return this.router.navigate(['/clients/edit', client.id])
              },
              disabled: (client: Client) => {
                return !this.permissionVerify('edit', client)
              }
            }
          },

          {
            icon: 'delete',
            label: 'Remover',
            removeWhenClickTrue: true,
            actions: {
              click: (client: Client) => {
                return this.delete(client)
              },
              disabled: (client: Client) => {
                return !this.permissionVerify('delete', client)
              }
            }
          },
        ],
        buttonStyle: { width: '5%' }
      },
      footer: {
        dataFields: [
          {
            style: { width: '16.66%', 'text-align': 'center' },
            label: 'Total',
            showData: (clients: Client[]) => { return clients.length }
          },
          {
            style: { width: '16.66%', 'text-align': 'right' },
            label: 'Inativo/Ativo',
            showData: (clients: Client[]) => {
              return this.statusInactive(clients) + '/' + this.statusActive(clients)
            }
          },
          {
            style: { width: '25%', 'text-align': 'right' },
            label: 'Agência/Expositor/Autônomo',
            showData: (clients: Client[]) => {
              return this.typeAgencia(clients) + '/' + this.typeExpositor(clients) + '/' + this.typeAutonomo(clients)
            }
          },
          {
            style: { width: '16.66%', 'text-align': 'right' },
            label: 'Score +3/-3',
            showData: (clients: Client[]) => {
              return this.score3Plus(clients) + '/' + this.score3Minus(clients)
            }
          },
          {
            style: { width: '25%', 'text-align': 'right' },
            label: 'Última atualização',
            component: UpdatedInfoComponent,
            afterCreateComponent: (obj, dataInfo: DataInfo, updatedInfo: UpdatedInfoComponent) => {
              updatedInfo.dataInfo = dataInfo
            }
          },
        ]
      }
    }
  }

  async delete(client: Client): Promise<boolean> {
    let data = await this.clientService.delete(client.id).toPromise()

    this.snackbar.open(data.message, '', {
      duration: 5000
    })

    return data.status
  }

  statusActive(clients: Client[]) {
    return clients.filter((client) => { return client.status.description == 'Ativo' }).length
  }

  statusInactive(clients: Client[]) {
    return clients.filter((client) => { return client.status.description == 'Inativo' }).length
  }

  typeAgencia(clients: Client[]) {
    return clients.filter((client) => { return client.type.description == 'Agência' }).length
  }

  typeExpositor(clients: Client[]) {
    return clients.filter((client) => { return client.type.description == 'Expositor' }).length
  }

  typeAutonomo(clients: Client[]) {
    return clients.filter((client) => { return client.type.description == 'Autônomo' }).length
  }

  score3Plus(clients: Client[]) {
    return clients.filter((client) => { return client.rate >= 3 }).length
  }

  score3Minus(clients: Client[]) {
    return clients.filter((client) => { return client.rate < 3 }).length
  }
}
