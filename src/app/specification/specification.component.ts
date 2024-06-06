import { Component, OnInit, Input } from '@angular/core';
import { Job } from '../jobs/job.model';
import { TaskService } from '../schedule/task.service';
import { Task } from '../schedule/task.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SpecificationFileService } from './specification-file.service';
import { StringHelper } from 'app/shared/string-helper.model';
import { JobService } from 'app/jobs/job.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { AuthService } from 'app/login/auth.service';

@Component({
  selector: 'cb-specification',
  templateUrl: './specification.component.html',
  styleUrls: ['./specification.component.css']
})
export class SpecificationComponent implements OnInit {
  @Input('typeForm') typeForm: string
  @Input() job: Job
  sortedTasks: Task[]
  expandedIndex: number = 0

  constructor(
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private datePipe: DatePipe,
    private authService: AuthService,
    private router: Router,
    private specificationFileService: SpecificationFileService,
    private taskService: TaskService,
    private jobService: JobService
  ) { }

  ngOnInit() {
    this.sortTasks()
    this.loadTaskFromRoute()
  }

  ngOnChanges() {
    this.sortTasks()
    this.loadTaskFromRoute()
    this.expandedIndex = this.expandedIndex == null ? 0 : this.expandedIndex
  }

  uploadDone(task: Task) {
    let newTask = this.sortedTasks.find(t => t.id == task.id)
    newTask.specification_files[newTask.specification_files.length - 1].responsible = this.authService.currentUser().employee
    this.sortedTasks[this.sortedTasks.findIndex(t => t.id == newTask.id)] = newTask
  }

  navigateToBudget(task: Task) {
    let snack = this.snackbar.open('Aguarde...')
    this.jobService.job(this.job.id).subscribe((job) => {
      snack.dismiss()
      let available_date = job.tasks.filter((t) => {
        return ['Orçamento', 'Modificação de orçamento'].indexOf(t.job_activity.description) >= 0 && t.task_id == task.id
      }).pop().items[0].date
      let url = '/schedule?date=' + this.datePipe.transform(available_date, 'yyyy-MM-dd')
      return this.router.navigateByUrl(url)
    })
  }

  description(task: Task) {
    let text = ''

    if(task.specification_files.length == 0) return text

    if(task.job_activity.description == 'Projeto')
      text = '- Memorial descritivo'
    else if(task.reopened > 0) {
      text = '- Memorial ' + StringHelper.padChar(task.reopened)
    }

    return text
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

  sortTasks() {
    this.sortedTasks = this.job.tasks.filter((task) => {
      return ['Memorial descritivo'].indexOf(task.job_activity.description) >= 0
    })
    this.sortedTasks.forEach((task, index) => {
      if(task.project_files.length > 0 && this.expandedIndex == null) {
        this.expandedIndex = index
      }
    })
  }



}
