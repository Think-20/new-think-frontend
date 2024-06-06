import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { state, style, trigger, animate, transition } from '@angular/animations';

import { AuthService } from '../auth.service'

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer'
import { API } from 'app/app.api';
import { MemoriesService } from 'app/memories/memories.service';
import { AlertService } from 'app/alerts/alerts.service';

@Component({
  selector: 'cb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('alert-message', [
      state('loading', style({
        color: 'rgb(255,255,255)',
        "background-color" : 'rgb(230,230,230)',
        'border-color' : 'rgb(230,230,230)'
      })),
      state('standard', style({
        color: '#aaa',
        "background-color" : 'transparent',
        'border-color' : '#dcdcdc'
      })),
      state('error', style({
        color: 'white',
        "background-color" : '#ff3e3e',
        'border-color' : '#de2c2c'
      })),
      state('success', style({
        color: '#00aff2',
        "background-color" : 'transparent',
        'border-color': '#00aff2'
      })),
      transition('* => *', animate('500ms 0s ease-in'))
    ])
  ]
})
export class LoginComponent implements OnInit {

  state: string = 'standard';
  message: string = 'VAMOS COMEÇAR';
  loginForm: FormGroup;
  API = API;
  readonly FRIDAY_DAY = 5;

  returnUrl: string

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private memoryService: MemoriesService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    this.auth.logout();

    this.loginForm = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.minLength(5)]),
      password: this.fb.control('', [Validators.required])
    })
  }

  login(data) {
    this.message = 'AGUARDE...'
    this.state = 'loading'

    this.auth.login(data).subscribe(data => {
      if(data.user === null) {
        this.state = 'error'
        this.message = 'USUÁRIO OU SENHA INCORRETOS'
        Observable.timer(3000).subscribe(timer => {
          this.state = 'standard'
          this.message = 'VAMOS COMEÇAR'
        })
        return true;
      }

      this.auth.setValidToken(true)
      this.state = 'success'
      this.message = 'OK'

      Observable.timer(1500).subscribe(timer => {
        this.auth.setData(data)
        //this.router.navigate([this.returnUrl]);

        const today = new Date();
        const isFriday = today.getDay() === this.FRIDAY_DAY;

        /* this.alertService.hasAlerts().subscribe(hasAlerts => {
          if (hasAlerts && isFriday) {
            this.router.navigate(['/alerts']);
          } else {
            this.router.navigate([this.returnUrl]);
          }
        }); */

        this.alertService.hasAlerts().subscribe(hasAlerts => {
          this.memoryService.getMemories().subscribe(memories => {
            if (hasAlerts && isFriday) {
              this.router.navigate(['/alerts']);
            } else if (memories[0].jobs.length > 0 || (memories[1].clients.length > 0 ) || (memories[2].jobs_approveds.length > 0 )) {
              this.router.navigate(['/memories']);
            } else {
              this.router.navigate([this.returnUrl]);
            }
          });
        });
      })
    })
  }
}
