import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ItemCategoryService } from '../item-category.service';
import { ItemCategory } from '../item-category.model';

@Component({
  selector: 'cb-item-category-show',
  templateUrl: './item-category-show.component.html'
})
export class ItemCategoryShowComponent implements OnInit {

  itemCategory: ItemCategory

  constructor(
    private route: ActivatedRoute,
    private itemCategoryService: ItemCategoryService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    let snackBar 
    let itemCategoryId = this.route.snapshot.params['id']
    snackBar = this.snackBar.open('Carregando categoria de item...')

    this.itemCategoryService.itemCategory(itemCategoryId)
    .subscribe(itemCategory => {
      this.itemCategory = itemCategory
      snackBar.dismiss()
    })        
  }

}
