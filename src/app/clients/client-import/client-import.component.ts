import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ClientService } from '../client.service';

@Component({
  selector: 'cb-client-import',
  templateUrl: './client-import.component.html',
  styleUrls: ['./client-import.component.css']
})
export class ClientImportComponent implements OnInit {

  @ViewChild('fileInput', { static: false }) fileInput
  informations: Array<any> = []
  clientForm: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private clientService: ClientService
  ) { }

  ngOnInit() {
    this.clientForm = this.formBuilder.group({
      file: this.formBuilder.control('', [ Validators.required ])
    })
  }

  uploadSheet() {
    let fileInput = this.fileInput.nativeElement
    if(fileInput.files && fileInput.files[0]) {
      let file = fileInput.files[0]
      this.clientService.uploadSheet(file).subscribe(data => {
        this.snackBar.open('Importação executada, veja as informações.', '', {
          duration: data.status ? 1000 : 5000
        })
        this.informations = data.informations
      })
    }
  }

}
