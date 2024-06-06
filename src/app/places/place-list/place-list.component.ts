import { Component, OnInit, Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { trigger, style, state, transition, animate, keyframes } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PlaceService } from '../place.service';
import { Place } from '../place.model';
import { AuthService } from '../../login/auth.service';
import { Pagination } from '../../shared/pagination.model';
import { DataInfo } from '../../shared/data-info.model';
import { distinctUntilChanged } from 'rxjs/operators';
import { debounceTime } from 'rxjs/operator/debounceTime';

@Component({
  selector: 'cb-place-list',
  templateUrl: './place-list.component.html',
  styleUrls: ['./place-list.component.css'],
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
@Injectable()
export class PlaceListComponent implements OnInit {

  rowAppearedState: string = 'ready'
  searchForm: FormGroup
  formCopy: any
  search: FormControl
  places: Place[] = []
  searching = false
  filter: boolean = false
  pagination: Pagination
  pageIndex: number
  params = {}
  hasFilterActive = false
  dataInfo: DataInfo

  constructor(
    private fb: FormBuilder,
    private placeService: PlaceService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  total(places: Place[]) {
    return places.length
  }

  permissionVerify(module: string, place: Place): boolean {
    let access: boolean
    let employee = this.authService.currentUser().employee
    switch(module) {
      case 'show': {
        access = this.authService.hasAccess('places/get/{id}')
        break
      }
      case 'edit': {
        access = this.authService.hasAccess('place/edit')
        break
      }
      case 'delete': {
        access = this.authService.hasAccess('place/remove/{id}')
        break
      }
      default: {
        access = false
        break
      }
    }
    return access
  }

  ngOnInit() {
    this.pageIndex = this.placeService.pageIndex

    this.createForm()
    this.loadInitialData()
  }

  createForm() {
    this.search = this.fb.control('')
    this.searchForm = this.fb.group({
      search: this.search,
    })

    this.formCopy = this.searchForm.value

    if(JSON.stringify(this.placeService.searchValue) == JSON.stringify({})) {
      this.placeService.searchValue = this.searchForm.value
    } else {
      this.searchForm.setValue(this.placeService.searchValue)
    }

    this.searchForm.valueChanges
    .pipe(distinctUntilChanged())
    .debounceTime(500)
    .subscribe((searchValue) => {
      this.params = this.getParams(searchValue)
      this.loadPlaces(this.params, 1)

      this.pageIndex = 0
      this.placeService.pageIndex = 0
      this.placeService.searchValue = searchValue
      this.updateFilterActive()
    })
  }

  getParams(searchValue) {
    return {
      search: searchValue.search,
    }
  }

  updateFilterActive() {
    if (JSON.stringify(this.placeService.searchValue) === JSON.stringify(this.formCopy)) {
      this.hasFilterActive = false
    } else {
      this.hasFilterActive = true
    }
  }

  clearFilter() {
    this.placeService.searchValue = {}
    this.placeService.pageIndex = 0
    this.pageIndex = 0
    this.createForm()
    this.loadInitialData()
  }

  loadInitialData() {
    if (JSON.stringify(this.placeService.searchValue) === JSON.stringify(this.formCopy)) {
      this.loadPlaces({}, this.pageIndex + 1)
    } else {
      this.params = this.getParams(this.placeService.searchValue)
      this.loadPlaces(this.params, this.placeService.pageIndex + 1)
    }

    this.updateFilterActive()
  }

  loadPlaces(params = {}, page: number) {
    this.searching = true
    let snackBar = this.snackBar.open('Carregando locais...')

    this.placeService.places(params, page).subscribe(dataInfo => {
      this.searching = false
      this.dataInfo = dataInfo
      this.pagination = dataInfo.pagination
      this.places = <Place[]> this.pagination.data
      snackBar.dismiss()
    })
  }

  delete(place: Place) {
    this.placeService.delete(place.id).subscribe((data) => {
      this.snackBar.open(data.message, '', {
        duration: 5000
      })

      if(data.status) {
        this.places.splice(this.places.indexOf(place), 1)
      }
    })
  }

  changePage($event) {
    this.searching = true
    this.places = []
    this.placeService.places(this.placeService.searchValue, ($event.pageIndex + 1)).subscribe(dataInfo => {
      this.searching = false
      this.dataInfo = dataInfo
      this.pagination = dataInfo.pagination
      this.places = <Place[]> this.pagination.data
      this.pageIndex = $event.pageIndex
      this.placeService.pageIndex = this.pageIndex
    })
  }

}
