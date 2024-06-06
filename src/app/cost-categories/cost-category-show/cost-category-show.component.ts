import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CostCategoryService } from '../cost-category.service';
import { CostCategory } from '../cost-category.model';

@Component({
  selector: 'cb-cost-category-show',
  templateUrl: './cost-category-show.component.html'
})
export class CostCategoryShowComponent implements OnInit {

  costCategory: CostCategory

  constructor(
    private route: ActivatedRoute,
    private costCategoryService: CostCategoryService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    let snackBar 
    let costCategoryId = this.route.snapshot.params['id']
    snackBar = this.snackBar.open('Carregando categoria de custo...')

    this.costCategoryService.costCategory(costCategoryId)
    .subscribe(costCategory => {
      this.costCategory = costCategory
      snackBar.dismiss()
    })        
  }

}
