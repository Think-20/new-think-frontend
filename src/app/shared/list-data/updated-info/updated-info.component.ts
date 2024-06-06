import { Component, OnInit, Input } from '@angular/core';
import { DataInfo } from 'app/shared/data-info.model';

@Component({
  selector: 'cb-updated-info',
  templateUrl: './updated-info.component.html',
  styleUrls: ['./updated-info.component.css']
})
export class UpdatedInfoComponent implements OnInit {

  @Input() dataInfo: DataInfo

  constructor() { }

  ngOnInit() {
  }

}
