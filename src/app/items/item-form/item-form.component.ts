import { Component, OnInit, Injectable, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
import { trigger, style, state, transition, animate, keyframes } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Item } from '../item.model';
import { ChildItem } from '../../child-items/child-item.model';
import { ItemCategory } from '../../item-categories/item-category.model';
import { CostCategory } from '../../cost-categories/cost-category.model';
import { Measure } from '../../measures/measure.model';
import { Provider } from '../../providers/provider.model';
import { Pricing } from '../../pricings/pricing.model';

import { ItemService } from '../item.service';
import { ItemCategoryService } from '../../item-categories/item-category.service';
import { CostCategoryService } from '../../cost-categories/cost-category.service';
import { MeasureService } from '../../measures/measure.service';
import { ProviderService } from '../../providers/provider.service';

import { ErrorHandler } from '../../shared/error-handler.service';
import { Patterns } from '../../shared/patterns.model';

import { Observable } from 'rxjs/Observable';
import { API } from '../../app.api';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import { isObject } from 'util';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'cb-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css'],
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
export class ItemFormComponent implements OnInit {

  @ViewChild('fileInput', { static: false }) fileInput
  typeForm: string
  rowAppearedState = 'ready'
  item: Item
  itemForm: FormGroup
  compositeItem: boolean = false
  items: Item[]
  itemCategories: ItemCategory[]
  costCategories: CostCategory[]
  measures: Observable<Measure[]>
  providers: Provider[]
  pricingsArray: FormArray
  imagePath: string = '/assets/images/sem-foto.jpg'

  constructor(
    private itemService: ItemService,
    private itemCategoryService: ItemCategoryService,
    private costCategoryService: CostCategoryService,
    private measureService: MeasureService,
    private providerService: ProviderService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    let snackBarStateCharging
    this.typeForm = this.route.snapshot.url[0].path

    this.itemForm = this.formBuilder.group({
      name: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]),
      description: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255)
      ]),
      item_type: this.formBuilder.control(0),
      image: this.formBuilder.control('sem-foto.jpg'),
      item_category: this.formBuilder.control('', [
        Validators.required
      ]),
      cost_category: this.formBuilder.control('', [
        Validators.required
      ]),
      pricings: this.formBuilder.array([]),
      childItems: this.formBuilder.array([])
    })

    let snackbar = null

    this.itemForm.get('item_category').valueChanges
    .do(() => snackbar = this.snackBar.open('Pesquisando categoria de item...'))
    .pipe(debounceTime(500), distinctUntilChanged())
    .subscribe(itemDescription => {
      snackbar.dismiss()

      if(itemDescription == '' || isObject(itemDescription)) return
      this.itemCategoryService.itemCategories({ search: itemDescription, paginate: false }).subscribe(dataInfo => {
        this.itemCategories = dataInfo.pagination.data
      })
    })

    this.itemForm.get('cost_category').valueChanges
    .do(() => snackbar = this.snackBar.open('Pesquisando categoria de custo...'))
    .pipe(debounceTime(500), distinctUntilChanged())
    .subscribe(costCategory => {
      snackbar.dismiss()

      if(costCategory == '' || isObject(costCategory)) return
      this.costCategoryService.costCategories({ search: costCategory, pagination: false }).subscribe(dataInfo => {
        this.costCategories = dataInfo.pagination.data
      })
    })

    this.itemForm.get('item_type').valueChanges.subscribe(value => {
      if(value == 1) {
        this.compositeItem = true
      } else {
        this.compositeItem = false
      }
    })

    if(this.typeForm === 'edit') {
      this.loadItem()
    }
  }

  showImage() {
    let fileInput = this.fileInput.nativeElement
    if(fileInput.files && fileInput.files[0]) {
      let file = fileInput._file ? fileInput._file : fileInput.files[0]
      this.itemService.uploadImage(file).subscribe(data => {
        this.imagePath = `${API}/assets/images/${data.name}`
        this.itemForm.get('image').setValue(data.name)
      })
    }
  }

  displayItem(item: Item): string {
    return item.name
  }

  displayMeasure(measure: Measure): string {
    return measure.description
  }

  displayProvider(provider: Provider): string {
    return provider.fantasy_name
  }

  displayItemCategory(itemCategory: ItemCategory): string {
    return itemCategory.description
  }

  displayCostCategory(costCategory: CostCategory): string {
    return costCategory.description
  }

  loadItem() {
    let snackBarStateCharging = this.snackBar.open('Carregando item...')
    let itemId = parseInt(this.route.snapshot.url[1].path)
    this.itemService.item(itemId).subscribe(item => {
      snackBarStateCharging.dismiss()
      this.item = item

      this.itemForm.controls.name.setValue(this.item.name)
      this.itemForm.controls.description.setValue(this.item.description)
      this.imagePath = `${API}/assets/images/${this.item.image}`
      this.itemForm.controls.item_category.setValue(this.item.item_category)
      this.itemForm.controls.cost_category.setValue(this.item.cost_category)
      this.itemForm.controls.item_type.setValue(this.item.item_type.id)

      let pricings = <FormArray>this.itemForm.controls.pricings
      for(let i = 0; i <= pricings.length; i++) {
        pricings.removeAt(0)
      }

      for(let pricing of item.pricings) {
        this.addPricing(pricing)
      }

      let childItems = <FormArray>this.itemForm.controls.childItems
      for(let i = 0; i <= childItems.length; i++) {
        childItems.removeAt(0)
      }

      for(let childItem of item.child_items) {
        this.addChildItem(childItem)
      }
    })
  }

  get pricings() { return this.itemForm.get('pricings'); }
  get childItems() { return this.itemForm.get('childItems'); }

  addPricing(pricing?: Pricing) {
    const pricings = <FormArray>this.itemForm.controls['pricings']

    pricings.push(this.formBuilder.group({
      id: this.formBuilder.control(pricing ? pricing.id : '' || ''),
      price: this.formBuilder.control(pricing ? pricing.price : '' || '', [
        Validators.required
      ]),
      measure: this.formBuilder.control(pricing ? pricing.measure : '' || '', [
        Validators.required
      ]),
      provider: this.formBuilder.control(pricing ? pricing.provider : '' || '', [
        Validators.required
      ])
    }))

    let pricingForm = <FormGroup>pricings.at((pricings.length - 1))

    /* Se for um preço existente, iniciar em modo bloqueado. */
    if(pricing) {
      pricingForm.disable()
    }

    pricingForm.get('measure').valueChanges.subscribe(measure => {
      this.measures = this.measureService.measures(measure)
    })

    pricingForm.get('provider').valueChanges.subscribe(value => {
      if( isObject(value) ) return false

      let snackBarStateCharging = this.snackBar.open('Aguarde...')
      this.providerService.providers({ search: value })
        .do(value => {
          snackBarStateCharging.dismiss()
        })
        .debounceTime(500)
        .subscribe((dataInfo) => {
          this.providers = <Provider[]> dataInfo.pagination.data
        })
    })
  }

  editPricing(i) {
    const pricings = <FormArray>this.itemForm.controls['pricings']
    let pricing: Pricing = pricings.at(i).value
    pricings.at(i).get('id').enable()
    pricings.at(i).get('price').enable()
  }

  savePricing(i) {
    const pricings = <FormArray>this.itemForm.controls['pricings']
    let pricing: Pricing = pricings.at(i).value

    this.itemService.savePricing(this.item, pricing).subscribe(data => {
      if(data.status) {
        pricings.at(i).disable()
        pricings.at(i).get('id').updateValueAndValidity(data.pricing.id)
      }

      let snack = this.snackBar.open(data.message, '', {
        duration: 3000
      })

      snack.afterDismissed().subscribe(() => this.loadItem())
    })
  }

  deletePricing(i) {
    const pricings = <FormArray>this.itemForm.controls['pricings']
    let pricing: Pricing = pricings.at(i).value
    //if(pricings.length > 1)

    this.itemService.removePricing(this.item, pricing).subscribe(data => {
      if(data.status) {
        pricings.removeAt(i)
      }
      let snack = this.snackBar.open(data.message, '', {
        duration: 3000
      })

      snack.afterDismissed().subscribe(() => this.loadItem())
    })

  }

  addChildItem(childItem?: ChildItem) {
    const childItems = <FormArray>this.itemForm.controls['childItems']

    childItems.push(this.formBuilder.group({
      id: this.formBuilder.control(childItem ? childItem.id : '' || ''),
      quantity: this.formBuilder.control(childItem ? childItem.quantity : '' || '', [
        Validators.required
      ]),
      measure: this.formBuilder.control(childItem ? childItem.measure : '' || '', [
        Validators.required
      ]),
      item: this.formBuilder.control(childItem ? childItem.item : '' || '', [
        Validators.required
      ])
    }))

    let childItemForm = <FormGroup>childItems.at((childItems.length - 1))

    /* Se for um preço existente, iniciar em modo bloqueado. */
    if(childItem) {
      childItemForm.disable()
    }

    let snackbar = null

    childItemForm.get('measure').valueChanges.subscribe(measure => {
      this.measures = this.measureService.measures(measure)
    })

    childItemForm.get('item').valueChanges
    .do(() => snackbar = this.snackBar.open('Pesquisando itens...'))
    .pipe(debounceTime(500), distinctUntilChanged())
    .subscribe(item => {
      snackbar.dismiss()

      if(item == '' || isObject(item)) return
      this.itemService.items({ search: item, pagination: false }).subscribe(dataInfo => {
        this.items = dataInfo.pagination.data
      })
    })
  }

  editChildItem(i) {
    const childItems = <FormArray>this.itemForm.controls['childItems']
    let childItem: Pricing = childItems.at(i).value
    childItems.at(i).get('id').enable()
    childItems.at(i).get('quantity').enable()
  }

  saveChildItem(i) {
    const childItems = <FormArray>this.itemForm.controls['childItems']
    let childItem: ChildItem = childItems.at(i).value

    this.itemService.saveChildItem(this.item, childItem).subscribe(data => {
      if(data.status) {
        childItems.at(i).disable()
        childItems.at(i).get('id').updateValueAndValidity(data.childItem.id)
      }

      let snack = this.snackBar.open(data.message, '', {
        duration: 3000
      })

      snack.afterDismissed().subscribe(() => this.loadItem())
    })
  }

  deleteChildItem(i) {
    const childItems = <FormArray>this.itemForm.controls['childItems']
    let childItem: ChildItem = childItems.at(i).value

    this.itemService.removeChildItem(this.item, childItem).subscribe(data => {
      if(data.status) {
        childItems.removeAt(i)
      }
      let snack = this.snackBar.open(data.message, '', {
        duration: 3000
      })

      snack.afterDismissed().subscribe(() => this.loadItem())
    })

  }

  getPricingsControls(itemForm: FormGroup) {
    return (<FormArray>this.itemForm.get('pricings')).controls
  }

  getChildItemsControls(itemForm: FormGroup) {
    return (<FormArray>this.itemForm.get('childItems')).controls
  }

  save(item: Item) {
    if(ErrorHandler.formIsInvalid(this.itemForm)) {
      this.snackBar.open('Por favor, preencha corretamente os campos.', '', {
        duration: 5000
      })
      return;
    }

    this.itemService.save(item).subscribe(data => {
      this.snackBar.open(data.message, '', {
        duration: data.status ? 1000 : 5000
      }).afterDismissed().subscribe(observer => {
        if(data.status) {
          this.router.navigate([`/items/edit`, data.item.id])
        }
      })
    })
  }

  edit(item: Item, itemId: number) {
    if(ErrorHandler.formIsInvalid(this.itemForm)) {
      this.snackBar.open('Por favor, preencha corretamente os campos.', '', {
        duration: 5000
      })
      return;
    }

    item.id = itemId

    this.itemService.edit(item).subscribe(data => {
      this.snackBar.open(data.message, '', {
        duration: data.status ? 1000 : 5000
      }).afterDismissed().subscribe(observer => {
        this.loadItem()
      })
    })
  }
}

