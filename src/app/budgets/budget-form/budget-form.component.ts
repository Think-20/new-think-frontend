import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Budget } from '../budget.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BudgetService } from '../budget.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorHandler } from '../../shared/error-handler.service';
import { Task } from '../../schedule/task.model';
import { distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService } from '../../login/auth.service';
import { Job } from 'app/jobs/job.model';
import { JobService } from 'app/jobs/job.service';
import { TaskService } from 'app/schedule/task.service';

@Component({
  selector: 'cb-budget-form',
  templateUrl: './budget-form.component.html',
  styleUrls: ['./budget-form.component.css']
})
export class BudgetFormComponent implements OnInit {
  /* budget: Budget
  budgetForm: FormGroup
  total: number = 0
  isAttendance: boolean = false
  isAdmin: boolean = false
  subscription: Subscription */
  @ViewChild('finalValue', { static : false }) finalValue: ElementRef;
  budgetForm = new FormGroup({});

  @Input('typeForm') typeForm: string
  @Input('task') task: Task
  @Input() job: Job
  sortedTasks: Task[]
  expandedIndex: number = null
  budgetForms: FormGroup[] = [];
  taskId;

  constructor(
    /* private budgetService: BudgetService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar, */
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private jobService: JobService,
    public taskService: TaskService,
    
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const taskId = params['taskId'];
      this.taskId = taskId
    });

    this.sortTasks();
    this.loadTaskFromRoute();
    this.createForm();
  }

  createForm() {
    this.budgetForms = this.sortedTasks.map(() =>
      this.formBuilder.group({
        id: this.formBuilder.control('', [Validators.required]),
        orders_value: this.formBuilder.control('', []),
        attendance_value: this.formBuilder.control('', []),
        creation_value: this.formBuilder.control('', []),
        pre_production_value: this.formBuilder.control('', []),
        production_value: this.formBuilder.control('', []),
        details_value: this.formBuilder.control('', []),
        budget_si_value: this.formBuilder.control('', []),
        bv_value: this.formBuilder.control('', []),
        over_rates_value: this.formBuilder.control('', []),
        discounts_value: this.formBuilder.control('', []),
        taxes_value: this.formBuilder.control('', []),
        logistics_value: this.formBuilder.control('', []),
        equipment_value: this.formBuilder.control('', []),
        total_cost_value: this.formBuilder.control('', []),
        gross_profit_value: this.formBuilder.control('', []),
        profit_value: this.formBuilder.control('', []),
        final_value: this.formBuilder.control('', [Validators.required]),
      })
    );

    this.sortedTasks.forEach((x, index) => this.fillForm(index))
  }

  fillForm(index: number): void {
    const formData = this.sortedTasks[index]; // Suponha que budgetFormData seja o array de objetos com os dados
    // Verifique se o índice é válido
    if (formData) {
      this.budgetForms[index].patchValue({
        id: formData.id,
        orders_value: formData.orders_value,
        attendance_value: formData.attendance_value,
        creation_value: formData.creation_value,
        pre_production_value: formData.pre_production_value,
        production_value: formData.production_value,
        details_value: formData.details_value,
        budget_si_value: formData.budget_si_value,
        bv_value: formData.bv_value,
        over_rates_value: formData.over_rates_value,
        discounts_value: formData.discounts_value,
        taxes_value: formData.taxes_value,
        logistics_value: formData.logistics_value,
        equipment_value: formData.equipment_value,
        total_cost_value: formData.total_cost_value,
        gross_profit_value: formData.gross_profit_value,
        profit_value: formData.profit_value,
        final_value: formData.final_value,
      });
    }
  }

  getTaskByProjectFiles(index) {
    if (!this.sortedTasks.length) {
      return;
    }

    const task = this.sortedTasks[index];
    return task.project_files[task.project_files.length - 1];
  }

  getTask(index) {
    if (!this.sortedTasks.length) {
      return;
    }

    const task = this.sortedTasks[index];
    return task;
  }

  getLastPersonWhoModified(index) {
    if (!this.sortedTasks.length) {
      return;
    }

    const task = this.sortedTasks[index];

    if (!this.getTaskByProjectFiles(index) || !this.getTaskByProjectFiles(index).responsible) {
      return;
    }

    return task.updated_by ? task.updated_by : this.getTaskByProjectFiles(index).responsible.name;
  }

  getLastPersonWhoModifiedDate(index) {
    if (!this.sortedTasks.length) {
      return;
    }

    const task = this.sortedTasks[index];

    if (!task && this.getTaskByProjectFiles(index)) {
        return this.getTaskByProjectFiles(index).updated_at;;
    }

    return task.updated_at ? task.updated_at : '';
  }

  sendValues(budgetForm: FormGroup) {
    budgetForm.updateValueAndValidity()
    
    if (ErrorHandler.formIsInvalid(budgetForm)) {
      this.snackBar.open('Por favor, preencha corretamente os campos.', '', {
        duration: 5000
      })
      return;
    }

    this.taskService.changeValues({...budgetForm.value, task_id: this.taskId}).subscribe(data => {
      this.snackBar.open(data.message, '', {
        duration: data.status ? 1000 : 5000
      })
    })
  }

  formatFinalValue(budgetForm: FormGroup) {
    const finalValue = this.finalValue.nativeElement.value;
    budgetForm.get('final_value').setValue(finalValue.replace('R$ ', ''));
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const keyCode = event.which || event.keyCode;
    const keyValue = String.fromCharCode(keyCode);

    if (!/^[0-9.,]$/.test(keyValue) && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
    }
  }

  sortTasks() {
    this.sortedTasks = this.job.tasks.filter((task) => {
      return task.job_activity.initial == 1
    });
    let adds = [];
    this.sortedTasks.filter((parentTask => {
      let temp = this.job.tasks.filter((task) => {
        return parentTask.job_activity.modification_id == task.job_activity_id
          || parentTask.job_activity.option_id == task.job_activity_id
      });
      adds = adds.concat(temp.reverse())
    }));
    this.sortedTasks = this.sortedTasks.concat(adds).reverse();

    this.sortedTasks.forEach((task, index) => {
      if(task.project_files.length > 0 && this.expandedIndex == null) {
        this.expandedIndex = index
      }
    })

    console.log(this.sortedTasks)
  }

  loadTaskFromRoute() {
    
    this.route.queryParams.subscribe((params) => {
      let taskId = params['taskId']
      this.sortedTasks.forEach((task, index) => {
        if(task.id == taskId) {
          this.expandedIndex = index
        }
      })
    })
  }

  /* ngOnInit() {
    this.isAdmin = this.authService.hasAccess('budget/save')
    this.isAttendance = this.job.attendance_id == this.authService.currentUser().employee.id

    this.budget = this.task.budget

    this.budgetForm = this.formBuilder.group({
      id: this.formBuilder.control({ value: (this.budget ? this.budget.id : ''), disabled: true }),
      task_id: this.formBuilder.control({ value: (this.budget ? this.budget.task_id : ''), disabled: true }),
      gross_value: this.formBuilder.control((this.budget ? this.budget.gross_value : ''), [Validators.required]),
      bv_value: this.formBuilder.control((this.budget ? this.budget.bv_value : ''), [Validators.required]),
      equipments_value: this.formBuilder.control((this.budget ? this.budget.equipments_value : ''), [Validators.required]),
      optional_value: this.formBuilder.control((this.budget ? this.budget.optional_value : '')),
      logistics_value: this.formBuilder.control((this.budget ? this.budget.logistics_value : ''), [Validators.required]),
      sales_commission_value: this.formBuilder.control((this.budget ? this.budget.sales_commission_value : '')),
      tax_aliquot: this.formBuilder.control({ value: (this.budget ? this.budget.tax_aliquot : '16.33'), disabled: true }),
      tax_value: this.formBuilder.control({ value: '', disabled: true }),
      others_value: this.formBuilder.control((this.budget ? this.budget.others_value : '')),
      markup_aliquot: this.formBuilder.control((this.budget ? this.budget.markup_aliquot : '35'), [
        Validators.max(100)
      ]),
      markup_value: this.formBuilder.control({ value: '', disabled: true }),
      discount_value: this.formBuilder.control({value: '', disabled: true })
    })

    if(this.isAttendance) {
      this.budgetForm.disable()
    }

    this.setFormConfig()
    this.addEvent()
    this.calculate()
  }

  addEvent() {
    this.subscription = this.budgetForm.valueChanges
    .pipe(distinctUntilChanged())
    .subscribe(() => {
      this.calculate()
    })
  }

  calculate() {
    let controls = this.budgetForm.controls
    let discount_aliquot: number = 0
    let cost = (
      this.getNumber('gross_value')
      + this.getNumber('optional_value')
      + this.getNumber('bv_value')
      + this.getNumber('equipments_value')
      + this.getNumber('logistics_value')
      + this.getNumber('sales_commission_value')
      + this.getNumber('others_value')
    )

    this.total = parseFloat((cost * ((100 + this.getNumber('markup_aliquot')) / 100)).toFixed(2))
    this.subscription.unsubscribe()

    if(this.total > 0) {
      discount_aliquot = this.getNumber('markup_aliquot') >= 35 ? 0.00 : 35.00 - this.getNumber('markup_aliquot')

      controls.discount_value.setValue((this.total * (discount_aliquot) / 100).toFixed(2))
      controls.tax_value.setValue((this.total / parseFloat(controls.tax_aliquot.value)).toFixed(2))
      controls.markup_value.setValue((cost * this.getNumber('markup_aliquot') / 100).toFixed(2))
    } else {
      controls.tax_value.setValue('')
      controls.discount_value.setValue('')
      controls.markup_value.setValue('')
    }

    this.addEvent()
  }

  getNumber(field: string): number {
    let val = this.budgetForm.controls[field].value
    val = val != null && val != '' && val != '0' ? val : 0
    return parseFloat(val)
  }

  setFormConfig() {
    if(this.typeForm == 'show') {
      this.budgetForm.disable()
    } else if(this.budget != null) {
      this.typeForm = 'edit'
    } else {
      this.typeForm = 'new'
    }
  }

  save() {
    this.budgetForm.updateValueAndValidity()
    let budget = this.budgetForm.getRawValue()
    budget.task = this.task

    if (ErrorHandler.formIsInvalid(this.budgetForm)) {
      this.snackBar.open('Por favor, preencha corretamente os campos.', '', {
        duration: 5000
      })
      return;
    }

    this.budgetService.save(budget).subscribe(data => {
      if (!data.status) {
        this.snackBar.open(data.message, '', {
          duration: 3000
        })
        return
      }

      this.snackBar.open('Orçamento salvo com sucesso!', '', {
        duration: 3000
      })
      this.budget = data.budget as Budget
      this.setFormConfig()
    })
  }

  edit() {
    this.budgetForm.updateValueAndValidity()
    let budget = this.budgetForm.getRawValue()
    budget.task = this.task
    budget.id = this.budget.id

    if (ErrorHandler.formIsInvalid(this.budgetForm)) {
      this.snackBar.open('Por favor, preencha corretamente os campos.', '', {
        duration: 5000
      })
      return;
    }

    this.budgetService.edit(budget).subscribe(data => {
      if (!data.status) {
        let snack = this.snackBar.open(data.message, '', {
          duration: 3000
        })
        return
      }

      let snack = this.snackBar.open('Orçamento editado com sucesso!', '', {
        duration: 3000
      })
      this.budget = data.budget as Budget
      this.setFormConfig()
    })
  } */
}
