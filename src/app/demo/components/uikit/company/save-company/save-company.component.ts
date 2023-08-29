import { Message } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { dE } from '@fullcalendar/core/internal-common';
import { Observable, catchError, of, tap } from 'rxjs';
import { CompanyDto } from 'src/app/models/dto/company-dto.model';
import { CompanyProjection } from 'src/app/models/projections/company-projection.model';
import { CompanyService } from 'src/app/services/company.service';
import { GlobalToasts, ToasMessageService, ToastMessageSeverity } from 'src/app/services/toas-message.service';


@Component({
  selector: 'app-save-company',
  templateUrl: './save-company.component.html',
  styleUrls: ['./save-company.component.scss']
})
export class SaveCompanyComponent implements OnInit {
    public submittedForm: boolean;
    public companyForm: FormGroup;
    public error: string;
    private modo: string;
    public loading: boolean;
    private id: string;
    constructor(private formBuilder: FormBuilder,
        private toastMessageService : ToasMessageService,
        private route: ActivatedRoute,
        private companyService: CompanyService,
        private router: Router){
        this.submittedForm = false;
        this.loading= false;
        this.error = '';
        this.modo='';
        this.id='';
        this.companyForm = this.initCompanyForm();

    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.modo = params['modo'];  // Acceder a las propiedades usando corchetes
            this.id = params['id'];      // Acceder a las propiedades usando corchetes
            console.log(params);
        });

        this.initCompany();
    }

    private initCompany(){
        if (this.modo != null && this.modo.includes('edit')) {

            this.companyService.findById(this.id)
                .pipe(
                    tap(company => this.manipulateSuccessInitCompany(company)),
                    catchError(error => this.manipulateErrorInitCompany(error)))
                .subscribe();
        }
    }



    /**
     * Método que inicializar los controladores del formulario
     * @returns retorna un formGroup
    */
    private initCompanyForm(): FormGroup {
        //this.submittedForm = false;
        this.error = '';
        return this.formBuilder.group({
            name: ['', [Validators.required, Validators.maxLength(200)]],
            email: ['', [Validators.required, Validators.maxLength(200)]],
            address: ['', [Validators.required, Validators.maxLength(200)]],
            rut: ['', [Validators.required,Validators.pattern(/\b(\d{1,3}(?:(\.?)\d{3}){2}(-?)[\dkK])\b/gm),Validators.maxLength(20)]],
            city: ['', [Validators.required]],
            faena: ['', [Validators.required]],
            contract_number: ['', [Validators.required]],
            password: ['', [Validators.required]],
        });
        //Validators.pattern(/\b(\d{1,3}(?:(\.?)\d{3}){2}(-?)[\dkK])\b/gm),Validators.maxLength(20) el posi
    }    //Validators.pattern('^\\d{7,8}[-][0-9kK]{1}$')
        //^0*(\d{1,3}(\.?\d{3})*)\-?([\dkK])$/

    get formControls() {
        return this.companyForm.controls;
    }


    public onSubmit(){
         this.submittedForm = true;
         this.loading = true;

        if (this.companyForm.invalid) {
            console.log('Formulario inválido');
            console.log(this.companyForm)
            this.toastMessageService.showToastMessage(
                GlobalToasts.TOAST_DASHBOAD,
                ToastMessageSeverity.SEVERITY_WARN,
                "Advertencia",
                "Hay campos requeridos sin completar");

            return;
        }

        const companyDto: CompanyDto = this.mapperCompanyFormToCompanyDto();

        if (this.modo.includes('save')){

            this.companyService.saveCompany(companyDto).pipe(
                tap(() => this.manipulateSuccessSaveCompany()),
                catchError(error => this.manipulateErrorSaveCompany(error))
            ).subscribe();

        }else if(this.modo.includes('edit')){
            this.companyService.updateCompany(this.id, companyDto ).pipe(
                tap(() => this.manipulateSuccessUpdateCompany()),
                catchError(error => this.manipulateErrorUpdateCompany(error))
            ).subscribe();
        }



    }


    /**
     * Método que mapea el formulario de contrato hito A ContratoHitoGuardarHitoDto
     * @returns retorna un objeto de tipo ContratoHitoGuardarHitoDto
     */
    private mapperCompanyFormToCompanyDto(): CompanyDto {

        const companyDto: CompanyDto = new CompanyDto();
        companyDto.name = this.companyForm.get('name')?.value;
        companyDto.email = this.companyForm.get('email')?.value;
        companyDto.address = this.companyForm.get('address')?.value;
        companyDto.rut = this.companyForm.get('rut')?.value;
        companyDto.city = this.companyForm.get('city')?.value;
        companyDto.faena = this.companyForm.get('faena')?.value;
        companyDto.contract_number = this.companyForm.get('contract_number')?.value;
        companyDto.password = this.companyForm.get('password')?.value;
        return companyDto;
    }

    private manipulateSuccessSaveCompany(){

        this.toastMessageService.showToastMessage(
            GlobalToasts.TOAST_DASHBOAD,
            ToastMessageSeverity.SEVERITY_SUCCESS,
            "Éxito",
            "Se ha agregado la empresa con éxito");
        setTimeout(() => {
            this.router.navigate(['/uikit/table']);
        }, 1000);


    }


    private manipulateErrorSaveCompany(error: any): Observable<null>{
        this.toastMessageService.showToastMessage(
            GlobalToasts.TOAST_DASHBOAD,
            ToastMessageSeverity.SEVERITY_ERROR,
            "Error",
            "Hubo un error al intentar agregar la empresa"
        );

        return of(null);
    }

    private manipulateSuccessInitCompany(company: CompanyProjection):void { // Este método es para poblar el formulario con los datos del

        this.companyForm.get('name').setValue(company?.name);
        this.companyForm.get('email').setValue(company?.email);
        this.companyForm.get('address').setValue(company?.address);
        this.companyForm.get('rut').setValue(company?.rut);
        this.companyForm.get('city').setValue(company.city);
        this.companyForm.get('faena').setValue(company.faena);
        this.companyForm.get('contract_number').setValue(company.contract_number);
        this.companyForm.get('password').setValue(company.password);
    }

    private manipulateErrorInitCompany(error:any){
        console.log(error);
        this.toastMessageService.showToastMessage(
            GlobalToasts.TOAST_DASHBOAD,
            ToastMessageSeverity.SEVERITY_ERROR,
            "Error",
            "Hubo un error al intentar cargar la empresa, por favor intente nuevamente. Si el error persiste comunicarse inmediatamente con el administrador."
        );
        setTimeout(() => {
            this.router.navigate(['/uikit/table']);
        }, 1000);
        return of(null);
    }

    private manipulateSuccessUpdateCompany() {

        this.toastMessageService.showToastMessage(
            GlobalToasts.TOAST_DASHBOAD,
            ToastMessageSeverity.SEVERITY_SUCCESS,
            "Éxito",
            "La empresa se ha actualizado con éxito");
        this.loading = false;

        setTimeout(() => {
            this.router.navigate(['/uikit/table']);
        }, 1000);

    }

    private manipulateErrorUpdateCompany(error: any) {
       const message = error?error.error.message: 'Hubo un error al actualizar la empresa';
        this.toastMessageService.showToastMessage(
            GlobalToasts.TOAST_DASHBOAD,
            ToastMessageSeverity.SEVERITY_ERROR,
            "Error",
            "Hubo un error al actualizar la empresa");
        this.loading = false;
        console.log("Error al guardar cambios en company..." + JSON.stringify(error));
        return of([]);

    }

}
