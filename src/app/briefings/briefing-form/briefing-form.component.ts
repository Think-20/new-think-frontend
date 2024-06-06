import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Briefing } from '../briefing.model';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { BriefingService } from '../briefing.service';
import { UploadFileService } from '../../shared/upload-file.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../../employees/employee.model';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ErrorHandler } from '../../shared/error-handler.service';
import { Patterns } from '../../shared/patterns.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import { isUndefined, isObject } from 'util';
import { BriefingPresentation } from '../../briefing-presentations/briefing-presentation.model';
import { Job } from '../../jobs/job.model';

@Component({
  selector: 'cb-briefing-form',
  templateUrl: './briefing-form.component.html',
  styleUrls: ['./briefing-form.component.css']
})
export class BriefingFormComponent implements OnInit {
  availableDateParam: string
  briefings: Briefing[]
  presentations: BriefingPresentation[]
  briefingForm: FormGroup
  responsibles: Employee[]
  @Input('job') job: Job
  @Input('briefing') briefing: Briefing
  @Input('isAdmin') isAdmin: boolean = false
  @Input('typeForm') typeForm: string
  @ViewChild('responsible', { static: false }) responsibleSelect

  constructor(
    private briefingService: BriefingService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.briefingForm = this.formBuilder.group({
      id: this.formBuilder.control({ value: '', disabled: true }),
      available_date: this.formBuilder.control('', [Validators.required]),
      responsible: this.formBuilder.control('', [Validators.required]),
      presentations: this.formBuilder.control('', [Validators.required]),
      estimated_time: this.formBuilder.control('1', [Validators.required]),
    })

    this.availableDateParam = this.typeForm == 'new' ? this.route.snapshot.params['available_date'] : ''

    if(this.job != null && this.job['briefing'] != null) {
      this.briefing = this.job['briefing']
      this.loadDefaultData(this.briefing)
    } else {
      this.loadDefaultData()
    }

    if(this.typeForm == 'show') {
      this.briefingForm.disable()
    }
  }

  toggleCreation() {
    if (!this.isAdmin) {
      this.responsibleSelect.close()
    }
  }

  loadDefaultData(briefing: Briefing = null) {
    let snackBarStateCharging = this.snackBar.open('Aguarde...')
    this.briefingService.loadFormData().subscribe((response) => {
      let data = response.data
      this.responsibles = data.responsibles

      if (this.availableDateParam == '' || this.availableDateParam == undefined) {
        snackBarStateCharging.dismiss()
        this.briefingForm.controls.responsible.setValue(data.responsible)
        this.briefingForm.controls.available_date.setValue(data.available_date)
        this.addListenerEstimatedTime()
        //snackBarStateCharging = this.snackBar.open('Considerando que o tempo de produção seja 1 dia, ' + data.responsible.name + ' foi selecionado.', '', {
          //duration: 2000
        //})

      } else {
        snackBarStateCharging.dismiss()
        this.briefingForm.controls.available_date.setValue(this.availableDateParam)
      }

      this.presentations = data.presentations

      if(briefing != null) {
        this.loadBriefingInForm(briefing)
      }
    })
  }

  loadBriefing() {
    let briefing = null
    this.loadBriefingInForm(briefing)
  }

  loadBriefingInForm(briefing: Briefing) {
    this.briefingForm.controls.available_date.setValue(briefing.available_date)
    this.briefingForm.controls.presentations.setValue(briefing.presentations)
    this.briefingForm.controls.responsible.setValue(briefing.responsible)
    this.briefingForm.controls.estimated_time.setValue(briefing.estimated_time)
  }

  addListenerEstimatedTime() {
    let snackBarStateCharging

    this.briefingForm.get('estimated_time').valueChanges
      .debounceTime(1000)
      .subscribe(nextEstimatedTime => {
        if(this.briefingForm.get('estimated_time').status == 'DISABLED') {
          return
        }

        snackBarStateCharging = this.snackBar.open('Aguarde...')
        this.briefingService.recalculateNextDate(nextEstimatedTime).subscribe((response) => {
          let data = response.data
          snackBarStateCharging.dismiss()
          /*
          let date = new Date(data.available_date)
          let formatedDate = ''

          if(date.getDate() < 10) {
            formatedDate += '0' + date.getDate() + '/'
          } else {
            formatedDate += date.getDate() + '/'
          }

          if((date.getMonth() + 1) < 10) {
            formatedDate += '0' + (date.getMonth() + 1) + '/'
          } else {
            formatedDate += (date.getMonth() + 1) + '/'
          }

          formatedDate += date.getFullYear()
          */

          this.briefingForm.controls.responsible.setValue(data.responsible)
          this.briefingForm.controls.available_date.setValue(data.available_date)

          //snackBarStateCharging = this.snackBar.open('Considerando a mudança no tempo de produção, ' + data.responsible.name + ' foi selecionado e a próxima data foi alterada.', '', {
            //duration: 2000
          //})
        })
        Observable.timer(500).subscribe(timer => snackBarStateCharging.dismiss())
      })
  }

  compareResponsible(var1: Employee, var2: Employee) {
    return var1.id === var2.id
  }

  comparePresentation(var1: BriefingPresentation, var2: BriefingPresentation) {
    return var1.id === var2.id
  }

  save() {
    this.briefingForm.updateValueAndValidity()
    let briefing = this.briefingForm.value
    briefing.job = this.job

    if (ErrorHandler.formIsInvalid(this.briefingForm)) {
      this.snackBar.open('Por favor, preencha corretamente os campos.', '', {
        duration: 5000
      })
      return;
    }

    this.briefingService.save(briefing).subscribe(data => {
      if (data.status) {
        this.briefing = data.briefing as Briefing
        let snack = this.snackBar.open('Briefing salvo com sucesso, redirecionando para o cronograma.', '', {
          duration: 3000
        })
        snack.afterDismissed().subscribe(() => {
          this.router.navigateByUrl('/schedule')
        })
      } else {
        this.snackBar.open(data.message, '', {
          duration: 5000
        })
      }

    })
  }

  edit() {
    this.briefingForm.updateValueAndValidity()
    let briefing = this.briefingForm.value
    briefing.id = this.briefing.id

    if (ErrorHandler.formIsInvalid(this.briefingForm)) {
      this.snackBar.open('Por favor, preencha corretamente os campos.', '', {
        duration: 5000
      })
      return;
    }

    this.briefingService.edit(briefing).subscribe(data => {
      this.snackBar.open(data.message, '', {
        duration: data.status ? 1000 : 5000
      }).afterDismissed().subscribe(observer => {
        if (data.status) {
          this.router.navigateByUrl('/schedule')
        }
      })
    })
  }
}
