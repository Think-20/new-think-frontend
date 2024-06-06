import { Component, OnInit, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ItemCategoryService } from '../item-category.service';
import { ItemCategory } from '../item-category.model';
import { ListData, mF } from 'app/shared/list-data/list-data.model';
import { Router } from '@angular/router';

@Component({
  selector: 'cb-item-category-list',
  templateUrl: './item-category-list.component.html'
})
@Injectable()
export class ItemCategoryListComponent implements OnInit {
  listData: ListData;
  constructor(
    private itemCategoryService: ItemCategoryService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.listData = {
      header: {
        filterFields: [
          mF({
            class: 'col-md-6',
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
            label: 'ID',
            style: { width: '10%' },
            showData: (itemCategory: ItemCategory) => {
              return itemCategory.id
            }
          },
          {
            label: 'Descrição',
            style: { width: '40%' },
            showData: (itemCategory: ItemCategory) => {
              return itemCategory.description
            }
          },
          {
            label: 'Categoria de item',
            style: { width: '40%' },
            showData: (itemCategory: ItemCategory) => {
              return itemCategory.item_category != null ? itemCategory.item_category.description : ''
            }
          },
        ],
        hasMenuButton: true,
        menuItems: [
          {
            icon: 'subject',
            label: 'Detalhes',
            actions: {
              click: (itemCategory: ItemCategory) => {
                return this.router.navigate(['/item-categories/show', itemCategory.id])
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
              click: (itemCategory: ItemCategory) => {
                return this.router.navigate(['/item-categories/edit', itemCategory.id])
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
              click: (itemCategory: ItemCategory) => {
                return this.delete(itemCategory)
              },
              disabled: () => {
                return false
              }
            }
          },
        ],
        loadData: (params, page) => {
          return this.itemCategoryService.itemCategories(params, page)
        },
        buttonStyle: { width: '10%' }
      }
    }
  }

  async delete(itemCategory: ItemCategory) {
    let data = await this.itemCategoryService.delete(itemCategory.id).toPromise()

    this.snackBar.open(data.message, '', {
      duration: 5000
    })

    return data.status
  }
}

