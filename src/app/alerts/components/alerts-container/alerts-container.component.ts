import { Component, OnInit } from '@angular/core';
import { AlertService } from 'app/alerts/alerts.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditStatus, ProjectData, ProjectStatus, Projects } from 'app/alerts/alerts.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alerts-container',
  templateUrl: './alerts-container.component.html',
  styleUrls: ['./alerts-container.component.css']
})
export class AlertsContainerComponent implements OnInit {

    projects: Projects;
    statusProjects: ProjectStatus[] = [];

  constructor(
        private alertService: AlertService,
        private snackBar: MatSnackBar,
        private router: Router
    ) { }

  ngOnInit() {
    this.loadStatus();
    this.load();
  }

  load(): void {
    const snackBar = this.snackBar.open('Carregando tarefas...')

    this.alertService.getAlerts().subscribe(dataInfo => {
      dataInfo ? this.projects = dataInfo.update_pendency : this.projects = { count: 0, data: []};
      
      if (dataInfo.update_pendency.count === 0) {
        this.snackBar.open('Nenhum alerta encontrado! Obrigado.', '', { duration: 3000 })

        this.alertService.setListEmpty(true);
        return setTimeout(() => {
          this.router.navigate(['/home'])
        }, 2000);
      }

      snackBar.dismiss();
    })
  }

  loadStatus(): void {
    this.statusProjects = this.alertService.getStatus();
  }

  updateStatusProject(selectedStatus: ProjectStatus, selectedProject: ProjectData): void {
    const payload: EditStatus = {
      id: selectedProject.id,
      status: {
        id: selectedStatus.id
      }
    }

    this.alertService.updateStatusProject(payload).subscribe(data => {
      this.snackBar.open(data.message, '', { duration: 4000 })
      this.load();
    });
  }
}
