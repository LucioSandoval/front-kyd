import { CompanyService } from '../../../../services/company.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Customer, Representative } from 'src/app/demo/api/customer';
import { CustomerService } from 'src/app/demo/service/customer.service';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { catchError, of, tap } from 'rxjs';
import { CompanyProjection } from 'src/app/models/projections/company-projection.model';
import { Router } from '@angular/router';
import { MessagesDemoComponent } from '../messages/messagesdemo.component';
import { GlobalToasts, ToasMessageService, ToastMessageSeverity } from 'src/app/services/toas-message.service';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    templateUrl: './company.component.html',
    providers: [MessageService, ConfirmationService]
})
export class companyComponent implements OnInit {
    public companies: CompanyProjection[];

    isExpanded: boolean = false;

    idFrozen: boolean = false;

    loading: boolean = true;


    constructor(private router: Router,

        private companyService:CompanyService,
        private confirmationService: ConfirmationService,
        private toastMessageService : ToasMessageService,
        ) {

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
        return alert('Hubo un error');
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

        this.toastMessageService.showToastMessage(
            GlobalToasts.TOAST_DASHBOAD,
            ToastMessageSeverity.SEVERITY_ERROR,
            "Érror",
            "Ha habido un error al intentar eliminar la empresa.");
        this.confirmationService.confirm({
            target: event.target,
            acceptLabel: 'Sí',
            message: 'Está seguro/a que desea eliminar esta empresa?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
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

        this.toastMessageService.showToastMessage(
            GlobalToasts.TOAST_DASHBOAD,
            ToastMessageSeverity.SEVERITY_SUCCESS,
            "Éxito", "Se ha eliminado la empresa con éxito."
        );
        setTimeout(()=>{
            alert("eliminado");
        },1000)

        this.companies.splice(this.companies.indexOf(company),1);



        //this.loading = false;
    }

    private manipulateErrorDeleteCompany(error: any) {

        console.log("error al eliminar company ",JSON.stringify(error));
        this.toastMessageService.showToastMessage(
            GlobalToasts.TOAST_DASHBOAD,
            ToastMessageSeverity.SEVERITY_ERROR,
            "Érror",
            "Ha habido un error al intentar eliminar la empresa.");
        //this.loading = false;

        return of([]);
    }
}


