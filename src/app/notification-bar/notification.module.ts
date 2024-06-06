import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { NotificationItemComponent } from '../notification-bar/notification-item/notification-item.component';

@NgModule({
  imports: [
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    CommonModule,
  ],
  exports: [
    NotificationItemComponent
  ],
  declarations: [
    NotificationItemComponent
  ],
  providers: [
    DatePipe,
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
  ],
})
export class NotificationModule { }
