import { OnInit, Component } from '@angular/core';
import { SimpleSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { MessageLoadingService } from './message-loading.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'message-loading-snackbar',
  template: `
    Aguarde... {{ counter | async }}%
  `
})
export class MessageLoadingComponent implements OnInit, SimpleSnackBar {
  data: { message: string; action: string; };
  snackBarRef: MatSnackBarRef<SimpleSnackBar>;

  action(): void {
    this.snackBarRef.dismiss()
  }

  hasAction: boolean;
  counter: Subject<number> = this.messageLoadingService.counter;

  ngOnInit(): void { }

  constructor(private messageLoadingService: MessageLoadingService) {}
}
