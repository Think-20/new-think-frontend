import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScheduleBlock } from '../schedule-block.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { User } from 'app/user/user.model';
import { Employee } from 'app/employees/employee.model';
import { ErrorHandler } from 'app/shared/error-handler.service';
import { ScheduleBlockService } from '../schedule-block.service';

export interface DialogBlockData {
  date: string
  employees: Employee[]
  scheduleBlocks: ScheduleBlock[]
}

@Component({
  selector: 'cb-block-dialog',
  templateUrl: './block-dialog.component.html',
  styleUrls: ['./block-dialog.component.css']
})
export class BlockDialogComponent implements OnInit {

  checked: boolean = false
  blockForm: FormGroup

  constructor(
    public dialogRef: MatDialogRef<BlockDialogComponent>,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private scheduleBlockService: ScheduleBlockService,
    @Inject(MAT_DIALOG_DATA) public data: DialogBlockData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.blockForm = this.fb.group({
      date: this.fb.control('', [Validators.required]),
      users: this.fb.control('')
    })

    this.blockForm.controls.date.setValue(new Date(this.data.date + "T00:00:00"))

    let scheduleDate = this.data.scheduleBlocks.filter((scheduleBlock) => {
      return scheduleBlock.date === this.data.date
    })

    if(scheduleDate.length === 0) return;

    let usersArray = []
    scheduleDate.pop().blocks.forEach(block => {
      let employee = this.data.employees.filter(employee => {
        return employee.user.id == block.user_id
      }).pop()

      if(employee != undefined)
        usersArray.push(employee.user)
    })

    this.blockForm.controls.users.setValue(usersArray)
  }

  selectAll() {
    if( this.checked ) {
      this.blockForm.controls.users.setValue([])
      return
    }

    this.blockForm.controls.users.setValue(this.data.employees.map((employee) => {
      return employee.user
    }))
  }

  compareEmployee(var1: User, var2: User) {
    return var1.id == var2.id
  }

  save(scheduleBlock: ScheduleBlock) {
    if (ErrorHandler.formIsInvalid(this.blockForm)) {
      this.snackBar.open('Por favor, preencha corretamente os campos.', '', {
        duration: 5000
      })
      return;
    }

    this.scheduleBlockService.save(scheduleBlock).subscribe(data => {
      if (data.status) {
        this.dialogRef.close()
      } else {
        this.snackBar.open(data.message, '', {
          duration: 5000
        })
      }
    })
  }

}
