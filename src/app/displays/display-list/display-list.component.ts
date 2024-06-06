import { Component, OnInit, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DisplayService } from '../display.service';
import { Display } from '../display.model';
import { AuthService } from '../../login/auth.service';
import { ListData, mF } from 'app/shared/list-data/list-data.model';
import { Router } from '@angular/router';

@Component({
  selector: 'cb-display-list',
  templateUrl: './display-list.component.html'
})
@Injectable()
export class DisplayListComponent implements OnInit {
  listData: ListData;
  constructor(
    private displayService: DisplayService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  permissionVerify(module: string, display: Display): boolean {
    let access: boolean
    switch(module) {
      case 'show': {
        access = display.id != display.id ? this.authService.hasAccess('displays/get/{id}') : true
        break
      }
      case 'edit': {
        access = display.id != display.id ? this.authService.hasAccess('display/edit') : true
        break
      }
      case 'delete': {
        access = display.id != display.id ? this.authService.hasAccess('display/remove/{id}') : true
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
            placeholder: 'Descrição',
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
            label: 'ID',
            style: { width: '12%' },
            showData: (display: Display) => {
              return display.id
            }
          },
          {
            label: 'Descrição',
            style: { width: '30%' },
            showData: (display: Display) => {
              return display.description
            }
          },
          {
            label: 'URL',
            style: { width: '50%' },
            showData: (display: Display) => {
              return display.url
            }
          },
        ],
        hasMenuButton: true,
        menuItems: [
          {
            icon: 'subject',
            label: 'Detalhes',
            actions: {
              click: (display: Display) => {
                return this.router.navigate(['/displays/show', display.id])
              },
              disabled: (display: Display) => {
                return !this.permissionVerify('show', display)
              }
            }
          },
          {
            icon: 'mode_edit',
            label: 'Editar',
            actions: {
              click: (display: Display) => {
                return this.router.navigate(['/displays/edit', display.id])
              },
              disabled: (display: Display) => {
                return !this.permissionVerify('edit', display)
              }
            }
          },
          {
            icon: 'delete',
            label: 'Remover',
            removeWhenClickTrue: true,
            actions: {
              click: (display: Display) => {
                return this.delete(display)
              },
              disabled: (display: Display) => {
                return !this.permissionVerify('delete', display)
              }
            }
          },
        ],
        loadData: (params, page) => {
          return this.displayService.displays(params, page)
        },
        buttonStyle: { width: '8%' }
      }
    }
  }

  async delete(display: Display) {
    let data = await this.displayService.delete(display.id).toPromise()

    this.snackBar.open(data.message, '', {
      duration: 5000
    })

    return data.status
  }
}
