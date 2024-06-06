import { Component, OnInit, Input } from '@angular/core';
import { ItemCategory } from '../../../item-categories/item-category.model';

@Component({
  selector: 'cb-item-proposal-form',
  templateUrl: './item-proposal-form.component.html',
  styleUrls: ['./item-proposal-form.component.css']
})
export class ItemProposalFormComponent implements OnInit {

  @Input() categories: ItemCategory[] = []
  @Input() sequence: string = ''
  show: boolean = false

  showToggle() {
    this.show = this.show ? false : true
  }

  constructor() { }

  ngOnInit() {
  }

}
