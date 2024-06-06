import { Component, OnInit, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventService } from '../event.service';
import { Event } from '../event.model';
import { AuthService } from '../../login/auth.service';
import { ListData, mF } from 'app/shared/list-data/list-data.model';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'cb-event-list',
  templateUrl: './event-list.component.html'
})
@Injectable()
export class EventListComponent implements OnInit {
  listData: ListData;
  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  permissionVerify(module: string, event: Event): boolean {
    let access: boolean
    switch(module) {
      case 'show': {
        access = event.id != event.id ? this.authService.hasAccess('events/get/{id}') : true
        break
      }
      case 'edit': {
        access = event.id != event.id ? this.authService.hasAccess('event/edit') : true
        break
      }
      case 'delete': {
        access = event.id != event.id ? this.authService.hasAccess('event/remove/{id}') : true
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
        filterFields: [
          mF({
            class: 'col-md-3',
            formcontrolname: 'search',
            placeholder: 'Nome',
            type: 'input'
          }),
        ],
        getParams: (formValue) => {
          return {
            search: formValue.search
          }
        }
      },
      body: {
        dataFields: [
          {
            label: 'Nome',
            style: { width: '20%' },
            showData: (event: Event) => {
              return event.name
            }
          },
          {
            label: 'Edição',
            style: { width: '10%' },
            showData: (event: Event) => {
              return event.edition
            }
          },
          {
            label: 'Local',
            style: { width: '30%' },
            showData: (event: Event) => {
              return event.place.name
            }
          },
          {
            label: 'Data',
            style: { width: '30%' },
            showData: (event: Event) => {
              return this.datePipe.transform(event.ini_date, 'dd/MM/yyyy')
              + ' a ' + this.datePipe.transform(event.fin_date, 'dd/MM/yyyy')
            }
          },

        ],
        hasMenuButton: true,
        menuItems: [
          {
            icon: 'subject',
            label: 'Detalhes',
            actions: {
              click: (event: Event) => {
                return this.router.navigate(['/events/show', event.id])
              },
              disabled: (event: Event) => {
                return !this.permissionVerify('show', event)
              }
            }
          },
          {
            icon: 'mode_edit',
            label: 'Editar',
            actions: {
              click: (event: Event) => {
                return this.router.navigate(['/events/edit', event.id])
              },
              disabled: (event: Event) => {
                return !this.permissionVerify('edit', event)
              }
            }
          },
          {
            icon: 'delete',
            label: 'Remover',
            removeWhenClickTrue: true,
            actions: {
              click: (event: Event) => {
                return this.delete(event)
              },
              disabled: (event: Event) => {
                return !this.permissionVerify('delete', event)
              }
            }
          },
        ],
        loadData: (params, page) => {
          return this.eventService.events(params, page)
        },
        buttonStyle: { width: '10%' }
      }
    }
  }

  async delete(event: Event) {
    let data = await this.eventService.delete(event.id).toPromise()

    this.snackBar.open(data.message, '', {
      duration: 5000
    })

    return data.status
  }
}
