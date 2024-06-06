import { Component, OnInit, Injectable, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Job } from '../job.model';
import { Observable } from 'rxjs/Observable';
import { JobService } from '../job.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { JobFormComponent } from '../job-form/job-form.component';

@Component({
  selector: 'cb-job-tabs',
  templateUrl: './job-tabs.component.html',
  styleUrls: ['./job-tabs.component.css']
})
@Injectable()
export class JobTabsComponent implements OnInit {
  @ViewChild('container', { static: false }) container: ElementRef
  @ViewChild(JobFormComponent, { static: false }) jobForm: JobFormComponent
  containerWidth: number
  typeForm: string
  job: Job
  isAdmin: boolean
  selectedIndex: number = 0
  tabs = [
    {index: 0, description: 'info'},
    {index: 1, description: 'briefing'},
    {index: 2, description: 'project'},
    {index: 3, description: 'specification'},
    {index: 5, description: 'budget-form'}
  ]

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
  ) { }

  ngOnInit() {
    this.typeForm = this.route.snapshot.url[0].path
    this.route.queryParams.subscribe((params) => {
      let next = params['tab']
      let tab = this.tabs.find(tab => tab.description == next)
      this.selectedIndex = tab != undefined ? tab.index : 0
    })

    this.initContainerWidthObservable()
  }

  tab($event: MatTabChangeEvent) {
    let target = this.tabs.find(tab => tab.index == $event.index).description

    const queryParams: Params = { tab: target };
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: queryParams,
        queryParamsHandling: "merge",
      });
  }

  initContainerWidthObservable() {
    let target = document.querySelector('#containerJobTabs')
    this.containerWidth = target.clientWidth

    /* Melhorar com biblioteca Resize aceitável pelos navegadores */
    Observable.timer(2000, 2000).subscribe(() => {
      if(target.clientWidth == this.containerWidth)
       return

      this.containerWidth = target.clientWidth
      //console.log('Atualizando....', this.containerWidth)
    })

    //console.log('Iniciando....', this.containerWidth)
  }

  displayNameEvent(job: Job) {
    return this.jobService.displayNameEvent(job)
  }

  showId(job: Job) {
    return this.jobService.showId(job)
  }

  setJob(job: Job) {
    this.job = job
  }

  setIsAdmin(isAdmin) {
    this.isAdmin = isAdmin
  }

  reload() {
    this.jobForm.loadJob()
  }
}
