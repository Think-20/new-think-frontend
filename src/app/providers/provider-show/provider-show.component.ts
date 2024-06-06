import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ProviderService } from '../provider.service';
import { Provider } from '../provider.model';

@Component({
  selector: 'cb-provider-show',
  templateUrl: './provider-show.component.html',
  styleUrls: ['./provider-show.component.css']
})
export class ProviderShowComponent implements OnInit {

  provider: Provider

  constructor(
    private route: ActivatedRoute,
    private providerService: ProviderService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    let snackBar 
    let providerId = this.route.snapshot.params['id']
    snackBar = this.snackBar.open('Carregando fornecedor...')

    this.providerService.provider(providerId)
    .subscribe(provider => {
      this.provider = provider
      snackBar.dismiss()
    })        
  }

}
