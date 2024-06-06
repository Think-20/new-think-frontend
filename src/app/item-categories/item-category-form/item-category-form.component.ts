import { Component, OnInit, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { trigger, style, state, transition, animate, keyframes } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ItemCategory } from '../item-category.model';
import { ItemCategoryService } from '../item-category.service';

import { Patterns } from '../../shared/patterns.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import { ErrorHandler } from '../../shared/error-handler.service';
import { isObject } from 'util';

@Component({
  selector: 'cb-item-category-form',
  templateUrl: './item-category-form.component.html',
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
export class ItemCategoryFormComponent implements OnInit {

  typeForm: string
  rowAppearedState = 'ready'
  itemCategory: ItemCategory
  itemCategoryForm: FormGroup
  itemCategories: ItemCategory[]

  constructor(
    private itemCategoryService: ItemCategoryService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    let snackBarStateCharging
    this.typeForm = this.route.snapshot.url[0].path

    let itemCategoryControl: FormControl = this.formBuilder.control('')

    this.itemCategoryForm = this.formBuilder.group({
      description: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]),
      item_category: itemCategoryControl
    })

    itemCategoryControl.valueChanges
      .do(itemDescription => {
         snackBarStateCharging = this.snackBar.open('Aguarde...')
      })
      .debounceTime(500)
      .subscribe(itemDescription => {
        if(itemDescription == '' || isObject(itemDescription)) {
          snackBarStateCharging.dismiss()
          return
        }

        this.itemCategoryService.itemCategories({ search: itemDescription, paginate: false }).subscribe(dataInfo => {
          this.itemCategories = dataInfo.pagination.data
          snackBarStateCharging.dismiss()
        })
      })

    if(this.typeForm === 'edit') {
      let snackBarStateCharging = this.snackBar.open('Carregando categoria de item...')
      let itemCategoryId = parseInt(this.route.snapshot.url[1].path)
      this.itemCategoryService.itemCategory(itemCategoryId).subscribe(itemCategory => {
        snackBarStateCharging.dismiss()
        this.itemCategory = itemCategory

        this.itemCategoryForm.controls.description.setValue(this.itemCategory.description)
        this.itemCategoryForm.controls.item_category.setValue(this.itemCategory.item_category || '')
      })
    }

  }

  displayItemCategory(itemCategory: ItemCategory) {
    return itemCategory.description
  }

  save(itemCategory: ItemCategory) {
    if(ErrorHandler.formIsInvalid(this.itemCategoryForm)) {
      this.snackBar.open('Por favor, preencha corretamente os campos.', '', {
        duration: 5000
      })
      return;
    }

    this.itemCategoryService.save(itemCategory).subscribe(data => {
      this.snackBar.open(data.message, '', {
        duration: 5000
      })
    })
  }

  edit(itemCategory: ItemCategory, itemCategoryId: number) {
    if(ErrorHandler.formIsInvalid(this.itemCategoryForm)) {
      this.snackBar.open('Por favor, preencha corretamente os campos.', '', {
        duration: 5000
      })
      return;
    }

    itemCategory.id = itemCategoryId

    this.itemCategoryService.edit(itemCategory).subscribe(data => {
      this.snackBar.open(data.message, '', {
        duration: 5000
      })
    })
  }

}

