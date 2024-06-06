import { Component, OnInit, Input } from '@angular/core';
import { Job } from '../jobs/job.model';
import { TaskService } from '../schedule/task.service';
import { Task } from '../schedule/task.model';
import { ActivatedRoute } from '@angular/router';

import { API } from '../app.api';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../login/auth.service';

@Component({
  selector: 'cb-proposals',
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.css']
})
export class ProposalsComponent implements OnInit {

  @Input() job: Job
  @Input() containerWidth: number
  sortedTasks: Task[]
  expandedIndex: number = null

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private sanitizer: DomSanitizer,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.sortTasks()
    this.loadTaskFromRoute()
  }

  ngOnChanges() {
    this.sortTasks()
    this.loadTaskFromRoute()
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

  getUrlMemorial(task: Task) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`${API}/task/memorial/${task.id}?${this.auth.queryAccess()}`)
  }

  sortTasks() {
    this.sortedTasks = this.job.tasks.filter((task) => {
      return ['Memorial descritivo'].indexOf(task.job_activity.description) == 0
    })
    this.sortedTasks.forEach((task, index) => {
      if(task.project_files.length > 0 && this.expandedIndex == null) {
        this.expandedIndex = index
      }
    })
  }

}
