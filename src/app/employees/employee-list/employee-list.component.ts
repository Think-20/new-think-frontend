import { Component, OnInit, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ListData, mF } from 'app/shared/list-data/list-data.model';
import { EmployeeService } from '../employee.service';
import { Router } from '@angular/router';
import { AuthService } from 'app/login/auth.service';
import { Employee } from '../employee.model';
import { DepartmentService } from 'app/department/department.service';
import { PositionService } from 'app/position/position.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'cb-employee-list',
  templateUrl: './employee-list.component.html'
})
@Injectable()
export class EmployeeListComponent implements OnInit {
  listData: ListData;
  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private positionService: PositionService,
    private datePipe: DatePipe,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  permissionVerify(module: string, employee: Employee): boolean {
    let access: boolean
    switch(module) {
      case 'show': {
        access = employee.id != employee.id ? this.authService.hasAccess('employees/get/{id}') : true
        break
      }
      case 'edit': {
        access = employee.id != employee.id ? this.authService.hasAccess('employee/edit') : true
        break
      }
      case 'toggle-deleted': {
        access = employee.id != employee.id ? this.authService.hasAccess('employee/toggle-deleted/{id}') : true
        break
      }
      default: {
        access = false
        break
      }
    }
    return access
  }

  ngOnInit() {
    this.listData = {
      header: {
        filterFields: [
          mF({
            arrayValues: this.positionService.positions()
            .map(dataInfo => dataInfo.pagination.data)
            .toPromise(),
            class: 'col-md-4',
            formcontrolname: 'position',
            placeholder: 'Função',
            type: 'select',
            optionDescription: 'name'
          }),
          mF({
            arrayValues: this.departmentService.departments()
            .map(dataInfo => dataInfo.pagination.data)
            .toPromise(),
            class: 'col-md-4',
            formcontrolname: 'department',
            placeholder: 'Departamento',
            type: 'select',
            optionDescription: 'description'
          }),
        ],
        getParams: (formValue) => {
          return {
            search: formValue.search,
            department: formValue.department,
            position: formValue.position,
          }
        }
      },
      body: {
        customRowStyle: (employee: Employee) => {
          return {
            'background-color': (employee.deleted_at != null ? 'rgba(0,0,0,0.03)' : 'inherit')
          };
        },
        dataFields: [
          {
            label: 'Nome',
            style: { width: '32%' },
            showData: (employee: Employee) => {
              return employee.name
            }
          },
          {
            label: 'Função',
            style: { width: '30%' },
            showData: (employee: Employee) => {
              return employee.position.name
            }
          },
          {
            label: 'Departamento',
            style: { width: '30%' },
            showData: (employee: Employee) => {
              return employee.department.description
            }
          },
        ],
        hasMenuButton: true,
        menuItems: [
          {
            icon: 'subject',
            label: 'Detalhes',
            actions: {
              click: (employee: Employee) => {
                return this.router.navigate(['/employees/show', employee.id])
              },
              disabled: (employee: Employee) => {
                return !this.permissionVerify('show', employee)
              }
            }
          },
          {
            icon: 'mode_edit',
            label: 'Editar',
            actions: {
              click: (employee: Employee) => {
                return this.router.navigate(['/employees/edit', employee.id])
              },
              disabled: (employee: Employee) => {
                return !this.permissionVerify('edit', employee)
              }
            }
          },
          {
            icon: 'delete',
            label: 'Desativar',
            removeWhenClickTrue: true,
            actions: {
              click: (employee: Employee, employeeList: Employee[]) => {
                return this.toggleDelete(employee, employeeList)
              },
              disabled: (employee: Employee) => {
                return (!this.permissionVerify('delete', employee)) && (employee.deleted_at != null)
              }
            }
          },
          {
            icon: 'undo',
            label: 'Restaurar',
            removeWhenClickTrue: true,
            actions: {
              click: (employee: Employee, employeeList: Employee[]) => {
                return this.toggleDelete(employee, employeeList)
              },
              disabled: (employee: Employee) => {
                return (!this.permissionVerify('delete', employee)) && (employee.deleted_at == null)
              }
            }
          },
        ],
        loadData: (params, page) => {
          return this.employeeService.employees({ deleted: true, ...params }, page)
        },
        buttonStyle: { width: '8%' }
      }
    }
  }

  async toggleDelete(employee: Employee, employees: Employee[]) {
    let employeeCopy = Object.create(employee)
    let data = await this.employeeService.toggleDeleted(employee.id).toPromise()

    this.snackBar.open(data.message, '', {
      duration: 5000
    })

    if(data.status) {
      let index = employees.indexOf(employee)
      employees[index].deleted_at = employeeCopy.deleted_at == null
        ? this.datePipe.transform(new Date(), 'YYYY-MM-DD hh:mm:ss')
        : null
    }

    return data.status
  }
}
