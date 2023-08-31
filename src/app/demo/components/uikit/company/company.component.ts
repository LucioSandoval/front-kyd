import { CompanyService } from '../../../../services/company.service';
import { Component, OnInit} from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { catchError, of, tap } from 'rxjs';
import { CompanyProjection } from 'src/app/models/projections/company-projection.model';
import { Router } from '@angular/router';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    templateUrl: './company.component.html',
    providers: [MessageService, ConfirmationService]
})
export class companyComponent implements OnInit {
    public companies: CompanyProjection[];
    public loading: boolean;


    constructor(private router: Router,
        private messageService: MessageService,
        private companyService:CompanyService,
        private confirmationService: ConfirmationService,
        ) {
            this.loading= false;
            this.companies=[]
        }

    ngOnInit() {
        this.initCompany();
    }








    private initCompany(): void{
        this.companyService.listCompany()
        .pipe(
        tap(companies => this.manipulateSuccessListCompany(companies)),
          catchError(error => this.manipulateErrorListCompany(error))
        ).subscribe();

    }

    private manipulateSuccessListCompany(companies: CompanyProjection[]): void {

        this.companies = companies;
        console.log(this.companies);
    }

    private manipulateErrorListCompany(error: any): any {
       
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Érror', detail: 'Hubo un error al intentar cargar las empresas, por favor intente nuevamente. Si el error persiste favor de comunicarse inmediatamente con el administrador.' });

        return of([]);
    }

    public newCompany(): void{
        this.router.navigate(['uikit/table/save-company'],
        { queryParams:
            { modo: 'save', id: 0 }
        });
    }

    public updateCompany(company: CompanyProjection):void{
        this.router.navigate(['uikit/table/save-company'],
        { queryParams:
            { modo: 'edit', id: company._id }
        });
    }

    public deleteCompany(event: Event, company:CompanyProjection):void{
        this.confirmationService.confirm({
            target: event.target,
            acceptLabel: 'Sí',
            message: 'Está seguro/a que desea eliminar esta empresa?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.loading= true;
                this.companyService.deleteCompany(company._id).pipe(
                    tap(() => this.manipulateSuccessDeleteCompany(company)),
                    catchError(error => this.manipulateErrorDeleteCompany(error))
                ).subscribe();
            },
            reject: () => {

                return false;

            }
        });


    }

    private manipulateSuccessDeleteCompany(company: CompanyProjection) {
        this.messageService.add({ key: 'tst', severity: 'success', summary: 'Éxito', detail: 'Se ha eliminado la empresa con éxito.' });
        this.companies.splice(this.companies.indexOf(company),1);



        this.loading = false;
    }

    private manipulateErrorDeleteCompany(error: any) {
        console.log("error al eliminar company ",JSON.stringify(error));
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Érror', detail: 'Ha habido un error al intentar eliminar la empresa.' });
        this.loading = false;

        return of([]);
    }
}


