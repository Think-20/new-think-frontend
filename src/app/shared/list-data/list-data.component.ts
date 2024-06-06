import { Component, OnInit, Input } from '@angular/core';
import { Client } from 'app/clients/client.model';
import { distinctUntilChanged } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DataInfo } from '../data-info.model';
import { Pagination } from '../pagination.model';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { FilterField, HeaderData, BodyData, ListDataMenuItem, FooterData, ListData, Identifiable } from 'app/shared/list-data/list-data.model';
import { ListDataService } from './list-data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'cb-list-data',
  templateUrl: './list-data.component.html',
  styleUrls: ['./list-data.component.css'],
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
      ])))
    ])
  ]
})
export class ListDataComponent implements OnInit {
  @Input() page: string
  @Input() searchPlaceholder: string = 'Qual registro você procura?'
  @Input() loadingMessage: string = 'Carregando...'
  @Input() addActionUrl: string = ''
  @Input() listData: ListData

  headerData: HeaderData
  bodyData: BodyData
  footerData: FooterData
  data: Array<any> = []

  rowAppearedState: string = 'ready'
  filter: boolean = false
  hasFilterActive: boolean = false
  filterFields: FilterField[]

  searchForm: FormGroup
  formCopy: any
  search: FormControl
  clients: Client[] = []
  searching = false
  pagination: Pagination
  pageIndex: number
  dataInfo: DataInfo
  params = {}

  constructor(
    private fb: FormBuilder,
    private listDataService: ListDataService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.headerData = this.listData.header
    this.bodyData = this.listData.body
    this.footerData = this.listData.footer

    this.filterFields = this.headerData.filterFields
    this.pageIndex = this.listDataService.getIndex(this.page)
    this.createForm()
    this.loadInitialData()
  }

  createForm() {
    this.search =  this.fb.control('')
    this.searchForm = this.fb.group({
      search: this.search
    })

    this.filterFields.forEach(filterField => {
      this.searchForm.addControl(filterField.formcontrolname, this.fb.control(''))
    })

    this.formCopy = this.searchForm.value

    if(JSON.stringify(this.listDataService.getSearchValue(this.page)) == JSON.stringify({})) {
      this.listDataService.saveSearchValue(this.page, this.searchForm.value)
    } else {
      this.searchForm.setValue(this.listDataService.getSearchValue(this.page))
    }

    this.searchForm.valueChanges
    .pipe(distinctUntilChanged())
    .debounceTime(500)
    .subscribe((searchValue) => {
      this.params = this.getParams(searchValue)
      this.loadData(this.params,  1)

      this.pageIndex = 0
      this.listDataService.saveIndex(this.page, 0)
      this.listDataService.saveSearchValue(this.page, searchValue)
      this.updateFilterActive()
    })
  }

  getParams(formValue) {
    return this.headerData.getParams(formValue)
  }

  updateFilterActive() {
    if (JSON.stringify(this.listDataService.getSearchValue(this.page)) === JSON.stringify(this.formCopy)) {
      this.hasFilterActive = false
    } else {
      this.hasFilterActive = true
    }
  }

  clearFilter() {
    this.listDataService.saveIndex(this.page, 0)
    this.listDataService.saveSearchValue(this.page, {})
    this.pageIndex = 0
    this.createForm()
    this.loadInitialData()
  }

  loadInitialData() {
    if (JSON.stringify(this.listDataService.getSearchValue(this.page)) === JSON.stringify(this.formCopy)) {
      this.loadData({}, this.pageIndex + 1)
    } else {
      this.params = this.listDataService.getSearchValue(this.page)
      this.loadData(this.params, this.listDataService.getIndex(this.page) + 1)
    }

    this.updateFilterActive()
  }

  loadDataObservable(params, page: number): Observable<DataInfo> {
    return this.bodyData.loadData(params, page)
  }

  loadData(params = {}, page: number) {
    this.searching = true
    let snackBar = this.snackBar.open(this.loadingMessage)

    this.loadDataObservable(params, page).subscribe(dataInfo => {
      this.searching = false
      this.dataInfo = dataInfo
      this.pagination = dataInfo.pagination
      this.data = this.pagination.data
      snackBar.dismiss()
    })
  }

  clickMenuItem(menuItem: ListDataMenuItem, obj, data: Array<any>) {
    menuItem.actions.click(obj, data).then((value) => {
      if(menuItem.removeWhenClickTrue && value) {
        this.data.splice(this.data.indexOf(data), 1)
      }
    });
  }

  changePage($event) {
    this.searching = true
    this.data = []
    this.loadDataObservable(this.listDataService.getSearchValue(this.page), ($event.pageIndex + 1)).subscribe(dataInfo => {
      this.searching = false
      this.dataInfo = dataInfo
      this.pagination = dataInfo.pagination
      this.data = this.pagination.data
      this.pageIndex = $event.pageIndex
      this.listDataService.saveIndex(this.page, this.pageIndex)
    })
  }

}
