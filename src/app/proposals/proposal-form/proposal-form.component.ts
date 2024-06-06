import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ItemCategory } from '../../item-categories/item-category.model';
import { ItemCategoryService } from '../../item-categories/item-category.service';
import { Job } from '../../jobs/job.model';
import { JobService } from 'app/jobs/job.service';

@Component({
  selector: 'cb-proposal-form',
  templateUrl: './proposal-form.component.html',
  styleUrls: ['./proposal-form.component.css']
})
export class ProposalFormComponent implements OnInit, AfterViewInit {

  @Input() job: Job
  @Input() containerWidth: number
  proposalForm: FormGroup
  categories: ItemCategory[] = []
  now: Date = new Date()

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: ItemCategoryService,
    private jobService: JobService
  ) { }

  ngOnInit() {
    this.proposalForm = this.formBuilder.group({})
    this.categoryService.itemsGroupByCategory().subscribe((itemCategories) => {
      this.categories = itemCategories
    })
  }

  showId(job: Job) {
    return this.jobService.showId(job)
  }

  ngAfterViewInit() {

  }

}
