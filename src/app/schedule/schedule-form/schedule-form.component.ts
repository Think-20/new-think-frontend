import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { JobStatus } from 'app/job-status/job-status.model';
import { JobActivity } from 'app/job-activities/job-activity.model';
import { Job } from 'app/jobs/job.model';
import { Employee } from 'app/employees/employee.model';
import { Client } from 'app/clients/client.model';
import { JobType } from 'app/job-types/job-type.model';
import { Subscription } from 'rxjs';
import { MatDatepicker } from '@angular/material/datepicker';
import { JobService } from 'app/jobs/job.service';
import { JobActivityService } from 'app/job-activities/job-activity.service';
import { JobStatusService } from 'app/job-status/job-status.service';
import { TaskService } from '../task.service';
import { EmployeeService } from 'app/employees/employee.service';
import { JobTypeService } from 'app/job-types/job-type.service';
import { AuthService } from 'app/login/auth.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isObject } from 'util';
import { Month, MONTHS } from 'app/shared/date/months';
import { ScheduleDate } from '../schedule-date/schedule-date.model';
import { ErrorHandler } from 'app/shared/error-handler.service';
import { Task } from '../task.model';
import { TaskItem } from '../task-item.model';
import { currency } from 'app/shared/formatter';

@Component({
  selector: 'cb-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.css']
})
export class ScheduleFormComponent implements OnInit {
  selectedItems: ScheduleDate[] = []
  items: ScheduleDate[]
  itemsByResponsible: ScheduleDate[] = []
  typeForm: string = 'new'
  filter: boolean = false
  scheduleForm: FormGroup
  searchForm: FormGroup
  job_activities: JobActivity[]
  all_job_activities: JobActivity[]
  job_status: JobStatus[]
  loadedItems: TaskItem[]
  dateSetManually: boolean = false
  params: () => {} = () => { return {} }
  callback: (jobs: Job[]) => void = (jobs) => { }
  isAdmin: boolean = false
  adminMode: boolean
  minDate: Date
  showExtraParams: boolean = true
  paramAttendance: Employee = null
  responsibles: Employee[] = []
  clients: Client[] = []
  availableDates: any = []
  job_types: JobType[] = []
  attendances: Employee[] = []
  creations: Employee[] = []
  url: string = '/jobs/new'
  buttonText: string = 'PRÓXIMO'
  durationErrorMessage: string
  budgetErrorMessage: string
  subscriptions: Subscription = new Subscription
  @ViewChild('availableDatepicker', { static: false }) availableDatepicker: MatDatepicker<Date>
  buttonEnable: boolean = true

  constructor(
    private formBuilder: FormBuilder,
    private jobService: JobService,
    private jobActivityService: JobActivityService,
    private jobStatusService: JobStatusService,
    private taskService: TaskService,
    private employeeService: EmployeeService,
    private jobTypeService: JobTypeService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.typeForm = this.route.snapshot.url[1].path
    this.isAdmin = this.authService.hasDisplay('schedule/new?adminmode')

    this.paramAttendance = this.authService.currentUser().employee.department.description === 'Atendimento'
      ? this.authService.currentUser().employee : null

    this.adminMode = false

    this.createForm()

    //Para edições...
    if(this.isAdmin && this.typeForm === 'edit') {
      this.adminMode = true;
      this.scheduleForm.controls.admin.setValue(true);
    }

    this.createValidations()
    this.loadFilterData()
    this.subscribeChangesOnAdminMode()

    if (this.typeForm == 'edit') {
      this.loadTask()
    }
  }

  subscribeChangesOnAdminMode() {
    this.subscriptions.add(
      this.scheduleForm.controls.admin.valueChanges.subscribe((value) => {
        if (value == false) this.createValidations()
        if (value == true) this.destroyValidations()

        this.adminMode = value
      })
    );
  }

  createValidations() {
    this.addValidationBudget()
    this.subscribeChangesOnAdminMode()
    this.subscribeChangesOnActivity()
  }

  destroyValidations() {
    this.subscriptions.unsubscribe()
    this.subscriptions = new Subscription;
    this.subscribeChangesOnAdminMode()
    this.removeValidationBudget();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }

  subscribeChangesOnActivity() {
    this.subscriptions.add(
      this.scheduleForm.controls.job_activity.valueChanges.subscribe((jobActivity: JobActivity) => {
        this.loadedItems = [];
        this.setTask(null);
        if (jobActivity.initial === 0) {
          if(this.typeForm !== 'edit')
            this.loadTasks();

          this.buttonText = 'SALVAR';
        } else {
          this.buttonText = 'PRÓXIMO';
        }

        if (jobActivity.no_params === 1) {
          this.showExtraParams = false;
          this.scheduleForm.controls.duration.disable();
          this.scheduleForm.controls.available_date.disable();
        } else {
          this.showExtraParams = true;
          this.scheduleForm.controls.duration.enable();
          this.scheduleForm.controls.available_date.enable();
        }

        if (jobActivity.keep_responsible === 1 && !this.adminMode) {
          this.scheduleForm.controls.responsible.disable();
        } else {
          this.scheduleForm.controls.responsible.enable();
        }

        let durationControl = this.scheduleForm.controls.duration
        durationControl.clearValidators()

        if (jobActivity.min_duration == 0
          && jobActivity.max_duration == 0
          && jobActivity.fixed_duration == 0) return;

        //Permitir cadastro de itens que serão arrumados no backend;
        if(jobActivity.fixed_duration > 0 && jobActivity.fixed_duration < 1) {
          jobActivity.fixed_duration = 1;
          this.scheduleForm.controls.budget_value.disable();
        } else {
          this.scheduleForm.controls.budget_value.enable();
        }

        //Cancelar validação de datas para modo admin
        if(this.adminMode) {
          return;
        }

        this.durationErrorMessage = 'Duração válida para a atividade selecionada:'
        this.durationErrorMessage += ' de ' + jobActivity.min_duration + ' a ' + jobActivity.max_duration
        this.durationErrorMessage += ' dia(s)'

        if (jobActivity.min_duration != 0 || jobActivity.max_duration != 0) {
          durationControl.setValidators([
            Validators.min(jobActivity.min_duration),
            Validators.max(jobActivity.max_duration)
          ])

          this.durationErrorMessage = 'Duração válida para a atividade selecionada:'
          this.durationErrorMessage += ' de ' + jobActivity.min_duration + ' a ' + jobActivity.max_duration
          this.durationErrorMessage += ' dia(s)'
        }

        if (jobActivity.fixed_duration != 0) {
          durationControl.setValidators([
            Validators.min(jobActivity.fixed_duration),
            Validators.max(jobActivity.fixed_duration)
          ])

          this.durationErrorMessage = 'Duração válida para a atividade selecionada:'
          this.durationErrorMessage += ' pré-definida em ' + jobActivity.fixed_duration
          this.durationErrorMessage += ' dia(s)'
        }

        durationControl.updateValueAndValidity();
      })
    );
  }

  setTask(task: Task) {
    if(this.scheduleForm.controls.available_date.value == '' || this.responsibles.length == 0) {
      this.snackBar.open('Selecione primeiro uma data para início e aguarde carregar os responsáveis.', '', { duration: 3000 });
      return;
    }

    this.scheduleForm.controls.task.setValue(task);

    if (task == null)
      return;

    this.scheduleForm.controls.budget_value.setValue(task.job.budget_value);

    if (this.scheduleForm.controls.job_activity.value.keep_responsible === 1) {
      this.scheduleForm.controls.responsible.setValue(task.responsible);
      this.filterItemsByResponsible()
    }
  }

  loadTasks() {
    let snackbar = this.snackBar.open('Buscando atividades, por favor aguarde...');
    let jobActivity = this.scheduleForm.controls.job_activity.value;
    let parent = this.all_job_activities
      .filter((ja) => ja.modification_id == jobActivity.id || ja.option_id == jobActivity.id)
      .pop();
    let controls = this.searchForm.controls;
    this.taskService.tasks({
      paginate: false,
      job_activity_array: [
        parent, parent.option
      ],
      status_array:
        this.job_status.filter(jobStatus => jobStatus.description !== 'Reprovado' && jobStatus.description !== 'Declinado'),
      clientName: controls.client.value,
      status: controls.status.value != undefined ? controls.status.value.id : null,
      attendance: controls.attendance.value,
      creation: controls.creation.value,
      job_type: controls.job_type.value
    }).subscribe(dataInfo => {
      this.loadedItems = (<Array<any>>dataInfo.pagination.data).reverse()
      snackbar.dismiss();
    });
  }

  loadFilterData() {
    this.jobStatusService.jobStatus().subscribe(jobStatus => {
      this.job_status = jobStatus
    })

    this.jobActivityService.jobActivities().subscribe(jobActivities => {
      this.job_activities = this.typeForm == 'new'
        ? jobActivities.filter((jobActivity) => jobActivity.visible == 1) : jobActivities
      this.all_job_activities = jobActivities;
    });

    this.jobTypeService.jobTypes().subscribe(job_types => this.job_types = job_types)

    // this.employeeService.canInsertClients().subscribe((attendances) => {
    //   this.attendances = attendances
    // })

    this.employeeService.employees().subscribe(dataInfo => {
      let employees = dataInfo.pagination.data
      this.creations = employees.filter(employee => {
        return employee.department.description === 'Criação'
      })

      this.attendances = employees.filter(employee => {
        return employee.department.description === 'Atendimento' || employee.department.description === 'Diretoria'
      })
    })
  }

  loadTask() {
    let taskId = parseInt(this.route.snapshot.url[2].path)
    let snack = this.snackBar.open('Carregando informações...')

    this.taskService.task(taskId).subscribe(task => {
      snack.dismiss()
      this.scheduleForm.controls.id.setValue(task.id)
      this.scheduleForm.controls.task.setValue(task.task)
      this.scheduleForm.controls.job_activity.setValue(task.job_activity)
      this.scheduleForm.controls.job_activity.disable()
      this.scheduleForm.controls.budget_value.setValue(task.job.budget_value)
      this.scheduleForm.controls.budget_value.disable()

      let duration = task.items.map(i => i.duration).reduce((p, n) => p + n);
      this.scheduleForm.controls.duration.setValue(duration > 0 ? duration : 1);

      this.responsibles = [task.responsible];
      this.scheduleForm.controls.responsible.setValue(task.responsible)
      this.scheduleForm.controls.available_date.setValue(new Date(task.items[0].date + "T00:00:00"))
      this.scheduleForm.controls.deadline.setValue(new Date(task.job.deadline + "T00:00:00"))
      this.scheduleForm.controls.deadline.disable()

      this.getAvailableDates()
    })
  }

  createForm() {
    this.scheduleForm = this.formBuilder.group({
      id: this.formBuilder.control(''),
      admin: this.formBuilder.control(''),
      job_activity: this.formBuilder.control('', [Validators.required]),
      duration: this.formBuilder.control('', [Validators.required]),
      available_date: this.formBuilder.control('', [Validators.required]),
      deadline: this.formBuilder.control('', [Validators.required]),
      budget_value: this.formBuilder.control('', [Validators.required]),
      responsible: this.formBuilder.control('', [Validators.required]),
      task: this.formBuilder.control('')
    })

    this.searchForm = this.formBuilder.group({
      attendance: this.formBuilder.control({ value: '', disabled: !this.isAdmin }),
      creation: this.formBuilder.control(''),
      job_type: this.formBuilder.control(''),
      client: this.formBuilder.control(''),
      status: this.formBuilder.control('')
    })

    if (this.paramAttendance != null) {
      this.searchForm.controls.attendance.setValue(this.paramAttendance)
      this.searchForm.controls.attendance.disable()
    }

    let snackbar;

    this.searchForm.valueChanges
    .do(() => {
      snackbar = this.snackBar.open('Aguardando sua busca terminar...')
    })
    .debounceTime(1000)
    .subscribe(() => {
      snackbar.dismiss();
      this.loadTasks();
    });
  }

  toggleDate(item: ScheduleDate, pos: number): boolean {
    if (item.status == 'false' && !this.adminMode) return;

    let i = -1

    this.selectedItems.forEach((selectedItem, index) => {
      if (selectedItem.date == item.date) i = index
    })

    if (i != -1) {
      if (this.adminMode) {
        this.selectedItems[i].selected = false
        this.selectedItems.splice(i, 1)
      } else if (this.checkValidDuration()) {
        /*
        * Desagrupar todos os itens quando clicar
        */
        while (this.selectedItems.length > 0) {
          this.selectedItems[0].selected = false
          this.selectedItems.splice(0, 1)
        }
      }
    } else {
      if (!this.checkValidDuration() || this.adminMode) {
        this.selectedItems.push(item)
        this.selectedItems[(this.selectedItems.length - 1)].selected = true
      }
      /*
       * Agrupar todos os itens quando clicar
       */
      while (this.checkValidDuration() === false) {
        pos++;
        this.toggleDate(this.itemsByResponsible[pos], pos);
      }
    }
  }

  hasSelectedItem(item: ScheduleDate) {
    return this.selectedItems.some(i => i.date == item.date && i.responsible_id == item.responsible_id)
  }

  getBudgetValidators(): ValidatorFn[] {
    let days = this.scheduleForm.controls.duration.value
    let jobActivity = this.scheduleForm.controls.job_activity.value
    let validators: ValidatorFn[] = []
    validators.push(Validators.required)

    if(jobActivity.min_duration === 0 && jobActivity.max_duration === 0) {
      return validators;
    }

    if (days <= 1) {
      validators.push(Validators.min(0))
      validators.push(Validators.max(80000))
      this.budgetErrorMessage = 'O valor deve estar entre 0,00 e 80.000,00 para até 1 dia'
    } else if (days <= 2) {
      validators.push(Validators.min(80000.01))
      validators.push(Validators.max(160000))
      this.budgetErrorMessage = 'O valor deve estar entre 80.000,00 e 160.000,00 para até 2 dias'
    } else if (days <= 3) {
      validators.push(Validators.min(160000.01))
      validators.push(Validators.max(250000))
      this.budgetErrorMessage = 'O valor deve estar entre 160.000,00 e 250.000,00 para até 3 dias'
    } else if (days <= 4) {
      validators.push(Validators.min(250000.01))
      validators.push(Validators.max(320000))
      this.budgetErrorMessage = 'O valor deve estar entre 250.000,00 e 320.000,00 para até 4 dias'
    } else if (days <= 5) {
      validators.push(Validators.min(320000.01))
      validators.push(Validators.max(500000))
      this.budgetErrorMessage = 'O valor deve estar entre 320.000,00 e 500.000,00 para até 5 dias'
    } else if (days > 5) {
      validators.push(Validators.min(500000.01))
      this.budgetErrorMessage = 'O valor deve ser maior que 500.000,00 para mais de 6 dias'
    }

    if (jobActivity.min_budget_value) {
      validators.push(Validators.min(jobActivity.min_budget_value))

      if (this.budgetErrorMessage.length > 0) {
        this.budgetErrorMessage += ' | '
      }
      this.budgetErrorMessage += 'O valor mínimo é ' + currency(jobActivity.min_budget_value) + ' para ' + jobActivity.description
      return validators;
    }

    return validators
  }

  addValidationBudget() {
    this.subscriptions.add(
      this.scheduleForm.controls.duration.valueChanges.subscribe(() => {
        this.scheduleForm.controls.budget_value.setValidators(this.getBudgetValidators())
        this.scheduleForm.controls.budget_value.updateValueAndValidity()
      })
    )
    this.subscriptions.add(
      this.scheduleForm.controls.job_activity.valueChanges.subscribe(() => {
        this.scheduleForm.controls.budget_value.setValidators(this.getBudgetValidators())
        this.scheduleForm.controls.budget_value.updateValueAndValidity()
      })
    )
  }

  removeValidationBudget() {
    this.scheduleForm.controls.budget_value.setValidators([]);
    this.scheduleForm.controls.budget_value.updateValueAndValidity();
  }

  compareResponsible(var1: Employee, var2: Employee) {
    return var1.id === var2.id
  }

  compareJobActivity(job1: JobActivity, job2: JobActivity) {
    return job1.id === job2.id
  }

  compareAttendance(var1: Employee, var2: Employee) {
    return var1.id === var2.id
  }

  compareStatus(var1: JobStatus, var2: JobStatus) {
    return var1.id === var2.id
  }

  compareJobType(var1: JobType, var2: JobType) {
    return var1.id === var2.id
  }

  getAvailableDates() {
    this.items = []
    this.itemsByResponsible = []
    this.selectedItems = []

    if(this.typeForm !== 'edit')
      this.scheduleForm.controls.responsible.setValue('')

    let availableDate = this.scheduleForm.controls.available_date.value
    let jobActivity = this.scheduleForm.controls.job_activity.value

    if (isObject(jobActivity) && jobActivity.no_params == 1) {
      let snackbar = this.snackBar.open('Carregando responsáveis...')
      this.taskService.responsiblesByActivity(jobActivity.id).subscribe((responsibles) => {
        this.responsibles = responsibles
        snackbar.dismiss()
      })
      return
    }

    if (!isObject(jobActivity) || availableDate == '') {
      this.snackBar.open('Escolha o tipo de atividade e uma data inicial para carregar as datas', '', { duration: 3000 })
      return
    }

    let snack = this.snackBar.open('Buscando as datas disponíveis para agenda, a partir de 30 dias da data escolhida')
    this.taskService.getAvailableDates({
      initialDate: this.datePipe.transform(availableDate, 'yyyy-MM-dd'),
      job_activity: jobActivity
    }).subscribe((data) => {
      this.items = data.items
      this.responsibles = data.responsibles

      snack.dismiss()
      snack = this.snackBar.open('Selecione um responsável para abrir as opções', '', { duration: 3000 })
      this.filterItemsByResponsible()
    })
  }

  filterItemsByResponsible() {
    if(this.scheduleForm.controls.responsible.value === '') return;

    this.itemsByResponsible = []
    this.selectedItems = []

    let responsible = <Employee>this.scheduleForm.controls.responsible.value
    this.itemsByResponsible = this.items.filter((item) => {
      return responsible.id == item.responsible_id
    })

    /* Pre-seleciona o item quando em modo administrador em edição */
    if(this.typeForm === 'edit' && this.adminMode) {
      this.itemsByResponsible.filter((item, i) => {
        if(item.date !== this.datePipe.transform(this.scheduleForm.controls.available_date.value, 'yyyy-MM-dd'))
          return;

        this.toggleDate(item, i);
      })
    }
  }

  checkValidation() {
    return this.checkValidDuration()
  }

  checkValidDuration() {
    return this.selectedItems.length == parseInt(this.scheduleForm.controls.duration.value)
      || (this.adminMode && this.selectedItems.length > 0)
      || this.scheduleForm.controls.job_activity.value.no_params === 1;
  }

  go() {
    if (ErrorHandler.formIsInvalid(this.scheduleForm) || !this.checkValidation()) {
      this.snackBar.open('Por favor, preencha corretamente os campos.', '', {
        duration: 5000
      })
      return;
    }

    let task = this.scheduleForm.getRawValue() as Task
    let jobActivity = <JobActivity>this.scheduleForm.controls.job_activity.value

    if (jobActivity.initial === 1) {
      let url = jobActivity.redirect_after_save != null && this.typeForm !== 'new'
        ? jobActivity.redirect_after_save
        : '/jobs/new'

      this.jobService.data = new Job
      this.jobService.data.task = task
      this.jobService.data.task.items = this.transformInTaskItems()
      this.jobService.data.budget_value = this.scheduleForm.controls.budget_value.value
      this.jobService.data.deadline = this.scheduleForm.controls.deadline.value
      this.jobService.data.job_activity = task.job_activity

      this.router.navigateByUrl(url)
    } else {
      task.items = this.transformInTaskItems()
      task.job = task.task.job;

      this.taskService.save(task).subscribe((data) => {
        if(data.status) {
          this.snackBar
          .open('Redirecionando para o cronograma...', '', { duration: 3000 })
          .afterDismissed().subscribe(() => {
            this.router.navigateByUrl('schedule?date=' + this.datePipe.transform(data.task.items[0].date, 'yyyy-MM-dd'));
          });
        } else {
          this.snackBar.open(data.message, '', { duration: 5000 });
        }
      });
    }
  }

  sumDuration() {
    return this.selectedItems
      .map(selectedItem => this.calculateAvailableDuration(selectedItem.duration))
      .reduce((prev, next) => prev + next, 0)
  }

  calculateAvailableDuration(duration: number): number {
    return (1 - duration)
  }

  transformInTaskItems(): TaskItem[] {
    return this.selectedItems.map(selectedItem => {
      let taskItem = new TaskItem;
      taskItem.date = selectedItem.date
      taskItem.responsible_id = selectedItem.responsible_id
      taskItem.duration = selectedItem.duration
      taskItem.budget_value = selectedItem.budget_value
      return taskItem;
    }).sort((a, b) => {
      return a.date > b.date ? 1 : -1;
    });
  }


  edit() {
    if (ErrorHandler.formIsInvalid(this.scheduleForm) || !this.checkValidation()) {
      this.snackBar.open('Por favor, preencha corretamente os campos.', '', {
        duration: 5000
      })
      return;
    }

    let task = this.scheduleForm.getRawValue() as Task
    let url = '/jobs/edit'

    this.jobService.data = new Job
    this.jobService.data.task = task
    this.jobService.data.task.items = this.transformInTaskItems()
    this.jobService.data.budget_value = this.scheduleForm.controls.budget_value.value
    this.jobService.data.deadline = this.scheduleForm.controls.deadline.value
    this.jobService.data.job_activity = task.job_activity

    this.taskService.edit(task).subscribe((data) => {
      if(data.status) {
        this.snackBar.open(data.message, '', {
          duration: 1500
        }).afterDismissed().subscribe(() => {
          this.router.navigateByUrl('/schedule?date=' + task.items[0].date)
        });
      } else {
        this.snackBar.open(data.message, '', {
          duration: 5000
        });
      }
    })
  }

}
