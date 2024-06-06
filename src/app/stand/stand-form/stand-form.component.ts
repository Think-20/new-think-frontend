import { Component, OnInit, Injectable, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
import { trigger, style, state, transition, animate, keyframes } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Stand } from '../stand.model';
import { StandService } from '../stand.service';

import { AuthService } from '../../login/auth.service';
import { UploadFileService } from '../../shared/upload-file.service';


import { ErrorHandler } from '../../shared/error-handler.service';
import { Patterns } from '../../shared/patterns.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import { StandConfiguration } from 'app/stand-configurations/stand-configuration.model';
import { StandConfigurationService } from 'app/stand-configurations/stand-configuration.service';
import { StandGenre } from 'app/stand-genres/stand-genre.model';
import { StandGenreService } from 'app/stand-genres/stand-genre.service';
import { StandItem } from 'app/stand/stand-items/stand-item.model';
import { Briefing } from 'app/briefings/briefing.model';
import { BriefingService } from 'app/briefings/briefing.service';
import { StandItemFormComponent } from 'app/stand/stand-items/stand-item-form/stand-item-form.component';
import { isUndefined } from 'util';
import { StandItemService } from 'app/stand/stand-items/stand-item.service';
import { JobService } from '../../jobs/job.service';
import { Job } from '../../jobs/job.model';

@Component({
  selector: 'cb-stand-form',
  templateUrl: './stand-form.component.html',
  styleUrls: ['./stand-form.component.css'],
  animations: [
    trigger('standItemAnimation', [
      state('visible', style({opacity: 1})),
      state('hidden', style({opacity: 0})),
      transition('hidden => visible', animate('300ms 0s ease-in', keyframes([
        style({opacity: 0, transform: 'translateX(-30px)', offset: 0}),
        style({opacity: 0.8, transform: 'translateX(10px)', offset: 0.8}),
        style({opacity: 1, transform: 'translateX(0px)', offset: 1})
      ]))),
      transition('visible => hidden', animate('300ms 0s ease-out', keyframes([
        style({opacity: 1, transform: 'translateX(0px)', offset: 0}),
        style({opacity: 0.8, transform: 'translateX(-10px)', offset: 0.2}),
        style({opacity: 0, transform: 'translateX(30px)', offset: 1})
      ]))),
    ])
  ]
})
@Injectable()
export class StandFormComponent implements OnInit {

  @Input() briefingForm: FormGroup
  @Input() briefing: Briefing
  @Input() job: Job
  @Input() stand: Stand
  typeForm: string
  standItemState = 'hidden'
  columns: any[] = [{id: 0, description: 'Não'}, {id: 1, description: 'Sim'}]
  configurations: StandConfiguration[]
  genres: StandGenre[]
  standForm: FormGroup
  closedItems: StandItem[] = []
  openedItems: StandItem[] = []
  closedItemsStates: any = []
  openedItemsStates: any = []

  constructor(
    private uploadFileService: UploadFileService,
    private briefingService: BriefingService,
    private jobService: JobService,
    private configurationService: StandConfigurationService,
    private standItemService: StandItemService,
    private dialog: MatDialog,
    private genreService: StandGenreService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    let stand = this.stand
    let snackBarStateCharging
    this.typeForm = this.route.snapshot.url[0].path

    this.standForm = this.formBuilder.group({
      id: this.formBuilder.control(stand ? stand.id : ''),
      configuration: this.formBuilder.control(stand ? stand.configuration : '', [Validators.required]),
      place: this.formBuilder.control(stand ? stand.place : '', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(150)
      ]),
      plan: this.formBuilder.control(stand ? stand.plan : '', [Validators.required]),
      regulation: this.formBuilder.control(stand ? stand.regulation : '', [Validators.required]),
      column: this.formBuilder.control(stand ? stand.column : '', [Validators.required]),
      street_number: this.formBuilder.control(stand ? stand.street_number : '', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(4)
      ]),
      note: this.formBuilder.control(stand ? stand.note : '', [
        Validators.minLength(3),
        Validators.maxLength(5000)
      ]),
      closed_area_percent: this.formBuilder.control(stand ? stand.closed_area_percent + '%' : '', [
        Validators.required,
        Validators.pattern(Patterns.percent)
      ]),
      opened_area_percent: this.formBuilder.control('', [
        Validators.required,
        Validators.pattern(Patterns.percent)
      ]),
      genre: this.formBuilder.control(stand ? stand.genre : '', [Validators.required]),
      note_opened_area: this.formBuilder.control(stand ? stand.note_opened_area : '', [
        Validators.minLength(3),
        Validators.maxLength(5000)
      ]),
      note_closed_area: this.formBuilder.control(stand ? stand.note_closed_area : '', [
        Validators.minLength(3),
        Validators.maxLength(5000)
      ]),
      closed_items: this.formBuilder.array([]),
      opened_items: this.formBuilder.array([]),
      area: this.formBuilder.control(stand ? stand.area.toString().replace('.',',') : '', [
        Validators.required,
        Validators.pattern(Patterns.float),
        Validators.maxLength(10),
      ]),
      budget: this.formBuilder.control(stand ? stand.budget : '', [
        Validators.required,
        Validators.maxLength(13),
      ]),
      area_budget: this.formBuilder.control(''),
    })

    this.briefingForm.controls.stand = this.standForm

    this.standForm.get('area').valueChanges.subscribe(() => {
      this.updateAreaBudget();
    })

    this.standForm.get('budget').valueChanges.subscribe(() => {
      this.updateAreaBudget();
    })

    snackBarStateCharging = this.snackBar.open('Aguarde...')

    this.configurationService.standConfigurations().subscribe((configurations) => {
      this.configurations = configurations
      this.genreService.standGenres().subscribe((genres) => {
        this.genres = genres
        snackBarStateCharging.dismiss()
      })
    })

    this.standForm.controls.closed_area_percent.valueChanges.subscribe(() => {
      this.updateOpenedArea()
    })

    stand ? this.updateOpenedArea() : null

    if(this.typeForm === 'show' && this.stand != null) {
      this.loadStandItems()
      this.standForm.disable()
    } else if(this.typeForm === 'edit' && this.stand != null) {
      this.loadStandItems()
    } else if(this.typeForm === 'new' || this.stand == null) {
      this.loadStandItemsDefault()
    }
  }

  updateAreaBudget() {
    let area = parseFloat(String(this.standForm.get('area').value).replace(',', '.'))
    let budget = parseFloat(String(this.standForm.get('budget').value).replace(',', '.'))
    let area_budget = (isNaN(area) || isNaN(budget)) ? '' : String((budget / area).toFixed(2))

    this.standForm.get('area_budget').setValue(area_budget)
  }

  loadStandItemsDefault() {
    let formClosedItems = <FormArray> this.standForm.controls.closed_items
    let formOpenedItems = <FormArray> this.standForm.controls.opened_items
    this.standItemService.defaultClosedItems().subscribe((standItems) => {
      this.closedItems = standItems
      standItems.forEach(standItem => {
        this.closedItemsStates.push({state: 'hidden'})
        formClosedItems.push(this.retrieveItemForm(standItem))
      })
    })
    this.standItemService.defaultOpenedItems().subscribe((standItems) => {
      this.openedItems = standItems
      standItems.forEach(standItem => {
        this.openedItemsStates.push({state: 'hidden'})
        formOpenedItems.push(this.retrieveItemForm(standItem))
      })
    })
  }

  loadStandItems() {
    let formClosedItems = <FormArray> this.standForm.controls.closed_items
    let formOpenedItems = <FormArray> this.standForm.controls.opened_items
    this.closedItems = this.stand.items.filter((standItem) => {
      if(standItem.type.description === 'Área fechada') {
        formClosedItems.push(this.retrieveItemForm(standItem))
        this.closedItemsStates.push({state: 'hidden'})
        return true
      }
    })
    this.openedItems = this.stand.items.filter((standItem) => {
      if(standItem.type.description === 'Área aberta') {
        formOpenedItems.push(this.retrieveItemForm(standItem))
        this.openedItemsStates.push({state: 'hidden'})
        return true
      }
    })
    this.updateAreaBudget()
  }

  updateOpenedArea() {
    let value = String(this.standForm.get('closed_area_percent').value).replace(',', '.')
    let openedValue = isNaN(parseInt(value)) || parseInt(value) > 100 ? '' : String(100 - parseInt(value)) + '%'
    this.standForm.get('opened_area_percent').setValue(openedValue)
  }

  uploadFile(key: string, inputFile: HTMLInputElement) {
    this.standForm.controls[key].setValue('Aguarde...')
    this.uploadFileService.uploadFile(inputFile).subscribe((data) => {
      let filename = data.names[0]
      this.standForm.controls[key].setValue(filename)
    })
  }

  previewFile(job: Job, type: string,  file: string) {
    this.jobService.previewFile(job, type, file)
  }

  download(job: Job, filename: string, type: String, file: String) {
    this.jobService.download(job, type, file).subscribe((blob) => {
      let fileUrl = URL.createObjectURL(blob)
      let anchor = document.createElement("a");
      anchor.download = filename;
      anchor.href = fileUrl;
      anchor.target = '_blank'
      anchor.click();
    })
  }

  compareConfiguration(var1: StandConfiguration, var2: StandConfiguration) {
    return var1.id === var2.id
  }

  compareColumn(var1: any, var2: any) {
    return var1.id === var2.id
  }

  compareGenre(var1: StandGenre, var2: StandGenre) {
    return var1.id === var2.id
  }

  hiddenClosedStandItem(i: number) {
    if(this.typeForm != 'show') this.closedItemsStates[i].state = 'hidden'
  }

  showClosedStandItem(i: number) {
    if(this.typeForm != 'show') this.closedItemsStates[i].state = 'visible'
  }

  hiddenOpenedStandItem(i: number) {
    if(this.typeForm != 'show') this.openedItemsStates[i].state = 'hidden'
  }

  showOpenedStandItem(i: number) {
    if(this.typeForm != 'show') this.openedItemsStates[i].state = 'visible'
  }

  retrieveItemForm(item: StandItem): FormGroup {
    return this.formBuilder.group({
      id: item.id,
      title: item.title,
      description: item.description,
      stand_item_type_id: item.stand_item_type_id,
      quantity: item.quantity
    })
  }

  openDialogItem(item?: StandItem) {
    let config = item ? { data: item } : null
    return this.dialog.open(StandItemFormComponent, config)
  }

  addClosedItem() {
    let dialog = this.openDialogItem()
    dialog.afterClosed().subscribe(data => {
      if(data != '') {
        let item = <StandItem> data.item
        item.id = null
        item.stand_item_type_id = 1
        this.closedItems.push(item)
        this.closedItemsStates.push({state: 'hidden'})
        let formArray = <FormArray> this.standForm.controls.closed_items
        formArray.push(this.retrieveItemForm(item))
      }
    })
  }

  editClosedItem(i, closed_item: StandItem) {
    let dialog = this.openDialogItem(closed_item)
    dialog.afterClosed().subscribe(data => {
      if(data != '') {
        let item = <StandItem> data.item
        this.closedItems[i] = item
        let formArray = <FormArray> this.standForm.controls.closed_items
        formArray.removeAt(i)
        formArray.insert(i, this.retrieveItemForm(item))
      }
    })
  }

  deleteClosedItem(i) {
    this.closedItemsStates.splice(i, 1)
    this.closedItems.splice(i, 1)
    let formArray = <FormArray> this.standForm.controls.closed_items
    formArray.removeAt(i)
  }

  addOpenedItem() {
    let dialog = this.openDialogItem()
    dialog.afterClosed().subscribe(data => {
      if(data != '') {
        let item = <StandItem> data.item
        item.id = null
        item.stand_item_type_id = 2
        this.openedItems.push(item)
        this.openedItemsStates.push({state: 'hidden'})
        let formArray = <FormArray> this.standForm.controls.opened_items
        formArray.push(this.retrieveItemForm(item))
      }
    })
  }

  editOpenedItem(i, opened_item: StandItem) {
    let dialog = this.openDialogItem(opened_item)
    dialog.afterClosed().subscribe(data => {
      if(data != '') {
        let item = <StandItem> data.item
        this.openedItems[i] = item
        let formArray = <FormArray> this.standForm.controls.opened_items
        formArray.removeAt(i)
        formArray.insert(i, this.retrieveItemForm(item))
      }
    })
  }

  deleteOpenedItem(i) {
    this.openedItemsStates.splice(i, 1)
    this.openedItems.splice(i, 1)
    let formArray = <FormArray> this.standForm.controls.opened_items
    formArray.removeAt(i)
  }
}

