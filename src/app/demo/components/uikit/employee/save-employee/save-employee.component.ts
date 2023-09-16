import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable, catchError, of, tap } from 'rxjs';
import { EmployeeDto } from 'src/app/models/dto/employee-dto.model';
import { CompanyProjection } from 'src/app/models/projections/company-projection.model';
import { EmployeeProjection } from 'src/app/models/projections/employee-projection.model';
import { CompanyService } from 'src/app/services/company.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ValidarRutUtil } from 'src/app/util/validar-rut-util';

@Component({
  selector: 'app-save-employee',
  templateUrl: './save-employee.component.html',
  styleUrls: ['./save-employee.component.scss']
})
export class SaveEmployeeComponent {

  public submittedForm: boolean;
  public employeeForm: FormGroup;
  public error: string;
  private modo: string;
  public loading: boolean;
  private rut: string;
  private id: string;
  public companies: CompanyProjection[];
  
  constructor(private formBuilder: FormBuilder,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private companyService:CompanyService,
    private router: Router) {
    this.submittedForm = false;
    this.loading = false;
    this.error = '';
    this.modo = '';
    this.rut = '';
    this.id= '';
;    this.companies = [];
    this.employeeForm = this.initEmployeeForm();

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.modo = params['modo'];  // Acceder a las propiedades usando corchetes
      this.rut = params['rut'];      // Acceder a las propiedades usando corchetes
      console.log(params);
    });
      this.initCompany();
      this.findByRutEmployee();
    
  }
  private findByRutEmployee() {
    if(this.modo != null && this.modo.includes('edit')){
      this.employeeService.findByRut(this.rut)
          .pipe(
            tap(company => this.manipulateSuccessFindByRutEmployee(company)),
            catchError(error => this.manipulateErrorFindByRutEmployee(error)))
          .subscribe();    
    }
    
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
  
    
  



  /**
   * Método que inicializar los controladores del formulario
   * @returns retorna un formGroup
  */
  private initEmployeeForm(): FormGroup {
    this.submittedForm = false;
    this.loading = false;
    this.error = '';
    return this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      age: [null, [Validators.required, Validators.maxLength(3)]],
      scholarship: ['', [Validators.required, Validators.maxLength(200)]],
      rut: ['', [Validators.required, Validators.pattern(/\b(\d{1,3}(?:(\.?)\d{3}){2}(-?)[\dkK])\b/gm), Validators.maxLength(20)]],
      post: ['', [Validators.required]],
      id_faena: ['', [Validators.required]],
      driver_license: ['', [Validators.required]],
      valid_driver_license: ['', [Validators.required]],
    });
  }    

  get formControls() {
    return this.employeeForm.controls;
  }


  public onSubmit() {
    this.submittedForm = true;

    debugger;
    if (this.employeeForm.invalid) {
      console.log('Formulario inválido');
      console.log(this.employeeForm)
      this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Advertencia', detail: 'Hay campos requeridos sin completar.' });
      return;
    }
    this.loading = true;
    const employeeDto: EmployeeDto = this.mapperEmployeeFormToEmployeeDto();
    if (this.modo.includes('save')) {

      this.employeeService.saveEmployee(employeeDto).pipe(
        tap(() => this.manipulateSuccessSaveEmployee()),
        catchError(error => this.manipulateErrorSaveEmployee(error))
      ).subscribe();

    } else if (this.modo.includes('edit')) {
      this.employeeService.updateEmployee(this.id, employeeDto).pipe(
        tap(() => this.manipulateSuccessUpdateEmployee()),
        catchError(error => this.manipulateErrorUpdateEmployee(error))
      ).subscribe();
    }



  }

  public findByRut(){
    debugger
    //employeeForm
    if(this.employeeForm.get('rut')?.invalid){
      return;
    }

    const rut = this.employeeForm.get('rut')?.value;

    if(!ValidarRutUtil.validarRut(rut)){
      this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Advertencia', detail: 'El rut ingresado no es válido.' });
      return;
    }

    this.employeeService.findByRut(rut).pipe(
        tap(employee => this.manipularExitoBuscarPersona(employee)),
        catchError(error=> this.manipularErrorBuscarPersona(error))
    ).subscribe();

  }
  private manipularExitoBuscarPersona(employee : EmployeeProjection | null) : void{
    debugger
    if(employee){ //Si la persona existe, poblar formulario
      this.employeeForm.get('name').setValue(employee?.name);
      this.employeeForm.get('rut').setValue(employee?.rut);
      this.employeeForm.get('age').setValue(employee?.age);
      this.employeeForm.get('scholarship').setValue(employee?.scholarship);
      this.employeeForm.get('post').setValue(employee.post);
      this.employeeForm.get('id_faena').setValue(employee.id_faena);
      this.employeeForm.get('driver_license').setValue(employee.driver_license);
      this.employeeForm.get('valid_driver_license').setValue(employee.valid_driver_license);
      return;
    }
    this.messageService.add({ key: 'tst', severity: 'warn', summary: '', detail: 'No se ha encontrado un trabajador con ese rut.' });
  }
  private manipularErrorBuscarPersona(error : any) : Observable<null>{
    debugger
    console.log("Error al employee por rut..." + JSON.stringify(error));
    this.messageService.add({ key: 'tst', severity: 'error', summary: 'Érror', detail: 'Hubo un error al intentar buscar el trabajador.' });
    return of(null);
  }


  /**
   * Método que mapea el formulario de contrato hito A ContratoHitoGuardarHitoDto
   * @returns retorna un objeto de tipo ContratoHitoGuardarHitoDto
   */
  private mapperEmployeeFormToEmployeeDto(): EmployeeDto {

    const employeeDto: EmployeeDto = new EmployeeDto();
    employeeDto.name = this.employeeForm.get('name')?.value;
    employeeDto.rut = this.employeeForm.get('rut')?.value;
    employeeDto.age = this.employeeForm.get('age')?.value;
    debugger
    employeeDto.scholarship = this.employeeForm.get('scholarship')?.value;
    
    employeeDto.post = this.employeeForm.get('post')?.value;
    employeeDto.id_faena = this.employeeForm.get('id_faena')?.value;
    employeeDto.driver_license = this.employeeForm.get('driver_license')?.value;
    employeeDto.valid_driver_license = this.employeeForm.get('valid_driver_license')?.value;
    return employeeDto;
  }

  private manipulateSuccessSaveEmployee() {
    this.messageService.add({ key: 'tst', severity: 'success', summary: 'Éxito', detail: 'Se ha agregado el trabajador con éxito.' });
    this.loading = false;
    setTimeout(() => {
      this.router.navigate(['/uikit/formlayout']);
    }, 500);


  }


  private manipulateErrorSaveEmployee(error: any): Observable<null> {
    debugger
    console.log("Error al guardar ..." + JSON.stringify(error));
    this.messageService.add({ key: 'tst', severity: 'error', summary: 'Érror', detail: 'Hubo un error al intentar registrar el trabajador.' });
    this.loading = false;
    return of(null);
  }

  private manipulateSuccessFindByRutEmployee(employee: EmployeeProjection): void { 
    this.id = employee._id;
    this.employeeForm.get('name').setValue(employee?.name);
    this.employeeForm.get('rut').setValue(employee?.rut);
    this.employeeForm.get('age').setValue(employee?.age);
    this.employeeForm.get('scholarship').setValue(employee?.scholarship);
    this.employeeForm.get('post').setValue(employee.post);
    this.employeeForm.get('id_faena').setValue(employee.id_faena);
    this.employeeForm.get('driver_license').setValue(employee.driver_license);
    this.employeeForm.get('valid_driver_license').setValue(employee.valid_driver_license);
  } 

  private manipulateErrorFindByRutEmployee(error: any) {
    
    console.log(error);
    this.messageService.add({ key: 'tst', severity: 'error', summary: 'Érror', detail: 'Hubo un error al intentar cargar la empresa, por favor intente nuevamente. Si el error persiste comunicarse inmediatamente con el administrador.' });
    this.router.navigate(['/uikit/formlayout']);
    return of(null);
  }

  private manipulateSuccessUpdateEmployee() {

    this.messageService.add({ key: 'tst', severity: 'success', summary: 'Éxito', detail: 'El trabajador se ha actualizado con éxito.' });

    this.loading = false;

    setTimeout(() => {
      this.router.navigate(['/uikit/formlayout']);
    }, 500);

  }

  private manipulateErrorUpdateEmployee(error: any) {
    //const message = error?error.error.message: 'Hubo un error al actualizar la empresa';
    this.messageService.add({ key: 'tst', severity: 'error', summary: 'Érror', detail: 'Hubo un error al actualizar el trabajador.' });
    this.loading = false;
    console.log("Error al alctualizar ..." + JSON.stringify(error));
    return of([]);

  }
}
