import { Component, OnInit, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { trigger, style, state, transition, animate, keyframes } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CostCategory } from '../cost-category.model';
import { CostCategoryService } from '../cost-category.service';

import { Patterns } from '../../shared/patterns.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import { ErrorHandler } from '../../shared/error-handler.service';

@Component({
  selector: 'cb-cost-category-form',
  templateUrl: './cost-category-form.component.html',
  animations: [
    trigger('rowAppeared', [
      state('ready', style({opacity: 1})),
      transition('void => ready', animate('300ms 0s ease-in', keyframes([
        style({opacity: 0, transform: 'translateX(-30px)', offset: 0}),
        style({opacity: 0.8, transform: 'translateX(10px)', offset: 0.8}),
        style({opacity: 1, transform: 'translateX(0px)', offset: 1})
      ]))),
      transition('ready => void', animate('300ms 0s ease-out', keyframes([
        style({opacity: 1, transform: 'translateX(0px)', offset: 0}),
        style({opacity: 0.8, transform: 'translateX(-10px)', offset: 0.2}),
        style({opacity: 0, transform: 'translateX(30px)', offset: 1})
      ]))),
    ])
  ]
})
@Injectable()
export class CostCategoryFormComponent implements OnInit {

  typeForm: string
  rowAppearedState = 'ready'
  costCategory: CostCategory
  costCategoryForm: FormGroup

  constructor(
    private costCategoryService: CostCategoryService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    let snackBarStateCharging
    this.typeForm = this.route.snapshot.url[0].path

    this.costCategoryForm = this.formBuilder.group({
      description: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ])
    })

    if(this.typeForm === 'edit') {
      let snackBarStateCharging = this.snackBar.open('Carregando categoria de custo...')
      let costCategoryId = parseInt(this.route.snapshot.url[1].path)
      this.costCategoryService.costCategory(costCategoryId).subscribe(costCategory => {
        snackBarStateCharging.dismiss()
        this.costCategory = costCategory

        this.costCategoryForm.controls.description.setValue(this.costCategory.description)
      })
    }

  }

  save(costCategory: CostCategory) {
    if(ErrorHandler.formIsInvalid(this.costCategoryForm)) {
      this.snackBar.open('Por favor, preencha corretamente os campos.', '', {
        duration: 5000
      })
      return;
    }

    this.costCategoryService.save(costCategory).subscribe(data => {
      this.snackBar.open(data.message, '', {
        duration: 5000
      })
    })
  }

  edit(costCategory: CostCategory, costCategoryId: number) {
    if(ErrorHandler.formIsInvalid(this.costCategoryForm)) {
      this.snackBar.open('Por favor, preencha corretamente os campos.', '', {
        duration: 5000
      })
      return;
    }

    costCategory.id = costCategoryId

    this.costCategoryService.edit(costCategory).subscribe(data => {
      this.snackBar.open(data.message, '', {
        duration: 5000
      })
    })
  }

}

