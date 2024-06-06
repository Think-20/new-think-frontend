import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { API } from '../../app.api';
import { ItemService } from '../item.service';
import { Item } from '../item.model';

@Component({
  selector: 'cb-item-show',
  templateUrl: './item-show.component.html',
  styleUrls: ['./item-show.component.css']
})
export class ItemShowComponent implements OnInit {

  item: Item

  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    let snackBar 
    let itemId = this.route.snapshot.params['id']
    snackBar = this.snackBar.open('Carregando item...')

    this.itemService.item(itemId)
    .subscribe(item => {
      this.item = item
      snackBar.dismiss()
    })        
  }

  getImage(imageName) {
    return `${API}/assets/images/${imageName}`
  }

}
