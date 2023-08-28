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

    public deleteCompany(company:CompanyProjection):void{
        this.companyService.deleteCompany(company._id).pipe(
            tap(() => this.successDeleteUsuario(company)),
            catchError(error => this.errorDeleteUsuario(error))
        ).subscribe(response => console.log(JSON.stringify(response)));


    }

    private successDeleteUsuario(company: CompanyProjection) {

        //this.toastMessageService.showToastMessage(GlobalToasts.BACK_OFFICE, ToastMessageSeverity.SEVERITY_SUCCESS, "Éxito", "Se ha eliminado el usuario con éxito.");
        this.companies.splice(this.companies.indexOf(company),1);
        alert("Eliminado")
        this.loading = false;
    }

    private errorDeleteUsuario(error: any) {

        //this.toastMessageService.showToastMessage(GlobalToasts.BACK_OFFICE, ToastMessageSeverity.SEVERITY_ERROR, "Érror", "Ha habido un error al intentar eliminar el usuario.");
        //this.loading = false;
        console.log("error al eliminar company ",JSON.stringify(error));
        return of([]);
    }
}


