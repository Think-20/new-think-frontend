import { Component, OnInit, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CostCategoryService } from '../cost-category.service';
import { CostCategory } from '../cost-category.model';
import { ListData, mF } from 'app/shared/list-data/list-data.model';
import { Router } from '@angular/router';

@Component({
  selector: 'cb-cost-category-list',
  templateUrl: './cost-category-list.component.html'
})
@Injectable()
export class CostCategoryListComponent implements OnInit {
  listData: ListData;
  constructor(
    private costCategoryService: CostCategoryService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

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
            style: { width: '10%' },
            showData: (costCategory: CostCategory) => {
              return costCategory.id
            }
          },
          {
            label: 'Descrição',
            style: { width: '80%' },
            showData: (costCategory: CostCategory) => {
              return costCategory.description
            }
          },
        ],
        hasMenuButton: true,
        menuItems: [
          {
            icon: 'subject',
            label: 'Detalhes',
            actions: {
              click: (costCategory: CostCategory) => {
                return this.router.navigate(['/cost-categories/show', costCategory.id])
              },
              disabled: () => {
                return false
              }
            }
          },
          {
            icon: 'mode_edit',
            label: 'Editar',
            actions: {
              click: (costCategory: CostCategory) => {
                return this.router.navigate(['/cost-categories/edit', costCategory.id])
              },
              disabled: () => {
                return false
              }
            }
          },
          {
            icon: 'delete',
            label: 'Remover',
            removeWhenClickTrue: true,
            actions: {
              click: (costCategory: CostCategory) => {
                return this.delete(costCategory)
              },
              disabled: () => {
                return false
              }
            }
          },
        ],
        loadData: (params, page) => {
          return this.costCategoryService.costCategories(params, page)
        },
        buttonStyle: { width: '10%' }
      }
    }
  }

  async delete(costCategory: CostCategory) {
    let data = await this.costCategoryService.delete(costCategory.id).toPromise()

    this.snackBar.open(data.message, '', {
      duration: 5000
    })

    return data.status
  }

}
