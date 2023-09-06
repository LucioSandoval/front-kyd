import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, of, tap } from 'rxjs';
import { EmployeeProjection } from 'src/app/models/projections/employee-projection.model';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
    templateUrl: './employee.component.html'
})
export class EmployeeComponent implements OnInit {
    public loading: boolean;
    public employees:EmployeeProjection[];
    constructor(
        private employeeService:EmployeeService,
        private messageService: MessageService,
        private router: Router,
        private confirmationService: ConfirmationService,
    ){
        this.employees = [];
        this.loading = false;
        
    }

    ngOnInit(): void {
        this.initEmployees();
    }

    private initEmployees(): void{
        this.employeeService.listEmployees()
        .pipe(
        tap(employees => this.manipulateSuccessListEmployees(employees)),
          catchError(error => this.manipulateErrorListEmployees(error))
        ).subscribe();

    }

    private manipulateSuccessListEmployees(employees: EmployeeProjection[]): void {
        console.log('empleadosss')
        this.employees = employees;
        console.log(this.employees);
    }

    private manipulateErrorListEmployees(error: any): any {
        console.log("error al listar employees ",JSON.stringify(error));
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Érror', detail: 'Hubo un error al intentar cargar los trabjadores, por favor intente nuevamente. Si el error persiste favor de comunicarse inmediatamente con el administrador.' });

        return of([]);
    }

    public newEmployee(): void{
        this.router.navigate(['uikit/formlayout/save-employee'],
        { queryParams:
            { modo: 'save', id: 0 }
        });
    }

    public updateEmployee(employee: EmployeeProjection):void{
        debugger
        this.router.navigate(['uikit/formlayout/save-employee'],
        { queryParams:
            { modo: 'edit', rut: employee.rut }
        });
    }

    public deleteEmployee(event: Event, employee:EmployeeProjection):void{
        debugger
        this.confirmationService.confirm({
            target: event.target,
            acceptLabel: 'Sí',
            message: 'Está seguro/a que desea eliminar este trabajador?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.loading= true;
                this.employeeService.deleteEmployee(employee._id).pipe(
                    tap(() => this.manipulateSuccessDeleteEmployee(employee)),
                    catchError(error => this.manipulateErrorDeleteEmployee(error))
                ).subscribe();
            }, 
            reject: () => {

                return false;

            }
        });


    }

    private manipulateSuccessDeleteEmployee(employee: EmployeeProjection) {
        this.messageService.add({ key: 'tst', severity: 'success', summary: 'Éxito', detail: 'Se ha eliminado la empresa con éxito.' });
        this.employees.splice(this.employees.indexOf(employee),1);
        this.loading = false;
    }

    private manipulateErrorDeleteEmployee(error: any) {
        console.log("error al eliminar company ",JSON.stringify(error));
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Érror', detail: 'Ha habido un error al intentar eliminar la empresa.' });
        this.loading = false;

        return of([]);
    }

}
