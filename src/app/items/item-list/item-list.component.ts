import { Component, OnInit, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ItemService } from '../item.service';
import { Item } from '../item.model';
import { ListData, mF } from 'app/shared/list-data/list-data.model';
import { Router } from '@angular/router';

@Component({
  selector: 'cb-item-list',
  templateUrl: './item-list.component.html'
})
@Injectable()
export class ItemListComponent implements OnInit {
  listData: ListData;
  constructor(
    private itemService: ItemService,
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
            label: 'Nome',
            style: { width: '25%' },
            showData: (item: Item) => {
              return item.name
            }
          },
          {
            label: 'Categoria de item',
            style: { width: '35%' },
            showData: (item: Item) => {
              return item.item_category.description
            }
          },
          {
            label: 'Categoria de custo',
            style: { width: '30%' },
            showData: (item: Item) => {
              return item.cost_category.description
            }
          },
        ],
        hasMenuButton: true,
        menuItems: [
          {
            icon: 'subject',
            label: 'Detalhes',
            actions: {
              click: (item: Item) => {
                return this.router.navigate(['/items/show', item.id])
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
              click: (item: Item) => {
                return this.router.navigate(['/items/edit', item.id])
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
              click: (item: Item) => {
                return this.delete(item)
              },
              disabled: () => {
                return false
              }
            }
          },
        ],
        loadData: (params, page) => {
          return this.itemService.items(params, page)
        },
        buttonStyle: { width: '5%' }
      }
    }
  }

  async delete(item: Item) {
    let data = await this.itemService.delete(item.id).toPromise()

    this.snackBar.open(data.message, '', {
      duration: 5000
    })

    return data.status
  }
}
