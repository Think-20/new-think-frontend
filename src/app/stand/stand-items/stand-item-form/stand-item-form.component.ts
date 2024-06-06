import { Component, OnInit, Injectable, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Stand } from '../../stand.model';
import { StandService } from '../../stand.service';

import { AuthService } from '../../../login/auth.service';
import { UploadFileService } from '../../../shared/upload-file.service';


import { ErrorHandler } from '../../../shared/error-handler.service';
import { Patterns } from '../../../shared/patterns.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import { StandItem } from 'app/stand/stand-items/stand-item.model';

@Component({
  selector: 'cb-stand-item-form',
  templateUrl: './stand-item-form.component.html',
  //styleUrls: ['./stand-item-form.component.css']
})
@Injectable()
export class StandItemFormComponent implements OnInit {

  typeForm: string
  standItemForm: FormGroup
  item: StandItem

  constructor(
    private uploadFileService: UploadFileService,
    public dialogRef: MatDialogRef<StandItemFormComponent>,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.item = this.data
    this.standItemForm = this.formBuilder.group({
      id: this.formBuilder.control(this.item ? this.item.id : ''),
      title: this.formBuilder.control(this.item ? this.item.title : '', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ]),
      quantity: this.formBuilder.control(this.item ? this.item.quantity : '', [
        Validators.required,
        Validators.pattern(Patterns.number),
        Validators.maxLength(2)
      ]),
      description: this.formBuilder.control(this.item ? this.item.description : '', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(5000)
      ]),
    })
  }

  save() {
    if(ErrorHandler.formIsInvalid(this.standItemForm)) {
      this.snackBar.open('Por favor, preencha corretamente os campos.', '', {
        duration: 5000
      })
      return;
    }

    this.dialogRef.close({item: this.standItemForm.value})
  }
}

