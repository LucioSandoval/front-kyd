import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, of, tap } from 'rxjs';
import { EmployeeProjection } from 'src/app/models/projections/employe-projection.model';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
    templateUrl: './employee.component.html'
})
export class EmployeeComponent implements OnInit {
    public employees:any[];

    constructor(
        private employeeService:EmployeeService,
        private messageService: MessageService,
    ){
        this.employees = [];
    }

    ngOnInit(): void {
        this.initEmployees();
    }

    private initEmployees(): void{
        debugger;
        this.employeeService.listEmployees()
        .pipe(
        tap(employees => this.manipulateSuccessListEmployees(employees)),
          catchError(error => this.manipulateErrorListEmployees(error))
        ).subscribe();

    }

    private manipulateSuccessListEmployees(employees: any[]): void {
        debugger
        console.log('empleadosss')
        this.employees = employees;
        console.log(this.employees);
    }

    private manipulateErrorListEmployees(error: any): any {
        debugger
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Érror', detail: 'Hubo un error al intentar cargar los trabjadores, por favor intente nuevamente. Si el error persiste favor de comunicarse inmediatamente con el administrador.' });

        return of([]);
    }

}
