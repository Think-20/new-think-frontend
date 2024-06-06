import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ROUTES } from '../app.routes';

import { NotificationItemComponent } from '../notification-bar/notification-item/notification-item.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NotificationModule } from '../notification-bar/notification.module';


@NgModule({
  imports: [
    CommonModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTooltipModule,
    MatBadgeModule,
    MatMenuModule,
    NotificationModule,

    RouterModule.forRoot(ROUTES)
  ],
  exports: [
    BrowserAnimationsModule,
    SidenavComponent,
    NavbarComponent
  ],
  declarations: [
    SidenavComponent,
    NavbarComponent,
  ]
})
export class HeaderModule { }
