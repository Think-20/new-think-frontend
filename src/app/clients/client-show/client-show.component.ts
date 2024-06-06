import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ClientService } from '../client.service';
import { Client } from '../client.model';
import { JobService } from '../../jobs/job.service';

@Component({
  selector: 'cb-client-show',
  templateUrl: './client-show.component.html',
  styleUrls: ['./client-show.component.css']
})
export class ClientShowComponent implements OnInit {

  client: Client

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService,
    private jobService: JobService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    let snackBar
    let clientId = this.route.params.subscribe(param => {
      snackBar = this.snackBar.open('Carregando cliente...')
      this.clientService.client(this.route.snapshot.params['id'])
      .subscribe(client => {
        this.client = client
        snackBar.dismiss()
      })
    })
  }

}
