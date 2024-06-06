import { Component, OnInit, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../login/auth.service';
import { ListData, mF } from 'app/shared/list-data/list-data.model';
import { Router } from '@angular/router';
import { FunctionalityService } from '../functionality.service';
import { Functionality } from '../functionality.model';

@Component({
  selector: 'cb-functionality-list',
  templateUrl: './functionality-list.component.html'
})
@Injectable()
export class FunctionalityListComponent implements OnInit {
  listData: ListData;
  constructor(
    private functionalityService: FunctionalityService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  permissionVerify(module: string, functionality: Functionality): boolean {
    let access: boolean
    switch(module) {
      case 'show': {
        access = functionality.id != functionality.id ? this.authService.hasAccess('functionalitys/get/{id}') : true
        break
      }
      case 'edit': {
        access = functionality.id != functionality.id ? this.authService.hasAccess('functionality/edit') : true
        break
      }
      case 'delete': {
        access = functionality.id != functionality.id ? this.authService.hasAccess('functionality/remove/{id}') : true
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
            showData: (functionality: Functionality) => {
              return functionality.id
            }
          },
          {
            label: 'Descrição',
            style: { width: '30%' },
            showData: (functionality: Functionality) => {
              return functionality.description
            }
          },
          {
            label: 'URL',
            style: { width: '50%' },
            showData: (functionality: Functionality) => {
              return functionality.url
            }
          },
        ],
        hasMenuButton: true,
        menuItems: [
          {
            icon: 'subject',
            label: 'Detalhes',
            actions: {
              click: (functionality: Functionality) => {
                return this.router.navigate(['/functionalities/show', functionality.id])
              },
              disabled: (functionality: Functionality) => {
                return !this.permissionVerify('show', functionality)
              }
            }
          },
          {
            icon: 'mode_edit',
            label: 'Editar',
            actions: {
              click: (functionality: Functionality) => {
                return this.router.navigate(['/functionalities/edit', functionality.id])
              },
              disabled: (functionality: Functionality) => {
                return !this.permissionVerify('edit', functionality)
              }
            }
          },
          {
            icon: 'delete',
            label: 'Remover',
            removeWhenClickTrue: true,
            actions: {
              click: (functionality: Functionality) => {
                return this.delete(functionality)
              },
              disabled: (functionality: Functionality) => {
                return !this.permissionVerify('delete', functionality)
              }
            }
          },
        ],
        loadData: (params, page) => {
          return this.functionalityService.functionalities(params, page)
        },
        buttonStyle: { width: '8%' }
      }
    }
  }

  async delete(functionality: Functionality) {
    let data = await this.functionalityService.delete(functionality.id).toPromise()

    this.snackBar.open(data.message, '', {
      duration: 5000
    })

    return data.status
  }
}
