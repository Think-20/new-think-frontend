import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Memory, TableInfo } from 'app/memories/memories.model';
import { MemoriesService } from 'app/memories/memories.service';


@Component({
  selector: 'app-memories-container',
  templateUrl: './memories-container.component.html',
  styleUrls: ['./memories-container.component.css']
})
export class MemoriesContainerComponent implements OnInit {

  @ViewChildren('collapse') collapses: QueryList<ElementRef>;

  memories: Memory[] = [];
  tables: TableInfo[] = [];
  currentTableIndex: number = 0;

  constructor(
    private snackBar: MatSnackBar,
    private memoriesService: MemoriesService
  ) { }

  ngOnInit() {
    this.load();
  }

  load(): void {
    const snackBar = this.snackBar.open('Carregando tarefas...')

    this.memoriesService.getMemories().subscribe(dataInfo => {
      this.memories = dataInfo || [];
      snackBar.dismiss();
    });

    this.tables = [
      { name: 'jobs', show: true, previousButton: false, nextButton: true },
      { name: 'jobsApproveds', show: false, previousButton: true, nextButton: true },
      { name: 'clients', show: false, previousButton: true, nextButton: false }
    ];
  }

  toggleTables(action: 'previous' | 'next', tableIndex: number): void {
    if (action === 'previous' && tableIndex > 0) {
      this.tables[tableIndex].show = false;
      this.tables[tableIndex - 1].show = true;
      this.currentTableIndex = tableIndex - 1;
    } else if (action === 'next' && tableIndex < this.tables.length - 1) {
      this.tables[tableIndex].show = false;
      this.tables[tableIndex + 1].show = true;
      this.currentTableIndex = tableIndex + 1;
    }
  }
}