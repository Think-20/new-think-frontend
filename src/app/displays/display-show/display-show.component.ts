import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DisplayService } from '../display.service';
import { Display } from '../display.model';
import { API } from '../../app.api';

@Component({
  selector: 'cb-display-show',
  templateUrl: './display-show.component.html',
  styleUrls: ['./display-show.component.css']
})
export class DisplayShowComponent implements OnInit {

  display: Display
  API = API

  constructor(
    private route: ActivatedRoute,
    private displayService: DisplayService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    let snackBar
    let displayId = this.route.params.subscribe(param => {
      snackBar = this.snackBar.open('Carregando dados...')
      this.displayService.display(this.route.snapshot.params['id'])
      .subscribe(display => {
        this.display = display
        snackBar.dismiss()
      })
    })
  }

}
