import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FunctionalityService } from '../functionality.service';
import { Functionality } from '../functionality.model';
import { API } from '../../app.api';

@Component({
  selector: 'cb-functionality-show',
  templateUrl: './functionality-show.component.html',
  styleUrls: ['./functionality-show.component.css']
})
export class FunctionalityShowComponent implements OnInit {

  functionality: Functionality
  API = API

  constructor(
    private route: ActivatedRoute,
    private functionalityService: FunctionalityService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    let snackBar
    let functionalityId = this.route.params.subscribe(param => {
      snackBar = this.snackBar.open('Carregando dados...')
      this.functionalityService.functionality(this.route.snapshot.params['id'])
      .subscribe(functionality => {
        this.functionality = functionality
        snackBar.dismiss()
      })
    })
  }

}
