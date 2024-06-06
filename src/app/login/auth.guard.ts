import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from './auth.service';
import { Location } from '@angular/common';
import { AlertService } from 'app/alerts/alerts.service';

@Injectable()
export class AuthGuard implements CanActivate {


    readonly FRIDAY_DAY = 5;
    hasAlertAndIsFriday: boolean;

    constructor(
        private router: Router,
        private auth: AuthService,
        private snackBar: MatSnackBar,
        private location: Location,
        private alertService: AlertService,
    ) {}

    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) {
        let iterativeRoute = route
        let user = this.auth.currentUser()
        let originalRoute = '/' + iterativeRoute.routeConfig.path

        while(iterativeRoute.parent !== null
            && iterativeRoute.parent.routeConfig !== null
            && iterativeRoute.parent.routeConfig.path != '')
        {
            iterativeRoute = iterativeRoute.parent
            originalRoute = '/' + iterativeRoute.routeConfig.path + originalRoute
        }

        let isLogged = await this.auth.isLogged()

        if( !isLogged ) {
            this.snackBar.open('Desculpe, sua sessão expirou.', '', { duration: 3000 })
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } })
            return false;
        }

        let foundDisplays = user.displays.filter(display => {
            return display.url === originalRoute && display.access === 'N'
        })

        if(foundDisplays.length > 0) {
            this.snackBar.open('Desculpe, você não tem permissão de acesso para essa funcionalidade.', '', { duration: 3000 })
            return false;
        }

        const today = new Date();

        this.alertService.hasAlerts().subscribe(hasAlerts => {
            const isFriday = today.getDay() === this.FRIDAY_DAY;
          
            if (hasAlerts && isFriday) {
              this.hasAlertAndIsFriday = true;
            }
        });

        this.alertService.listEmpty$.subscribe(isListEmpty => {
            if (isListEmpty && iterativeRoute.routeConfig.path !== 'alerts') {
              this.snackBar.open('Por favor, atualize os status de todos os projetos antes de navegar pelo sistema.', '', { duration: 3000 });
              return false;
            }
        });

        return true;
    }

}
