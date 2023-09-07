import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { takeUntil, Subject, tap, catchError, Observable, of } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { LoginDto } from 'src/app/models/dto/login-dto.model';
import { UserDto } from 'src/app/models/dto/user-dto.model';
import { LoginResponseProjection } from 'src/app/models/projections/login-response-projection.model';
import { LoginService } from 'src/app/services/login.service';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent implements OnDestroy{//OnDestroy
    public submittedForm: boolean;
    public error: string;
    public loading: boolean;
    public loginForm: FormGroup;
    public loginResponse: LoginResponseProjection;
    private unsuscribe$: Subject<void> = new Subject();


    valCheck: string[] = ['remember'];

    password!: string;

    constructor( private messageService: MessageService,
        private formBuilder: FormBuilder,
        private loginService: LoginService,
        private router: Router,
        ) { 
        this.submittedForm = false;
        this.loading= false;
        this.error = '';
        this.loginForm = this.initLoginForm();
    }


    ngOnDestroy(): void {
        this.unsuscribe$.next();
        this.unsuscribe$.complete();
        this.unsuscribe$.unsubscribe();
    }


    private initLoginForm(): FormGroup {
        return this.formBuilder.group({
            
            email: [new FormControl, [Validators.required, Validators.maxLength(50)]],
            password: [new FormControl, [Validators.required, Validators.maxLength(20)]],
        });
    }    

    get formControls() {
        return this.loginForm.controls;
    }


    public onSubmit(): void{
        this.submittedForm = true;
        if (this.loginForm.invalid) {
            console.log('Formulario inválido');
            console.log(this.loginForm)
            this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Advertencia', detail: 'Hay campos requeridos sin completar.' });
            return;
        }
        this.loading = true;
        const loginDto: LoginDto = this.mapperLoginFormToLoginDto();
        this.loginService.login(loginDto).pipe(
            takeUntil(this.unsuscribe$),
            tap((user) => this.manipulateSuccessLogin(user)),
            catchError(error => this.manipulateErrorLogin(error))
        ).subscribe();
    }

    private mapperLoginFormToLoginDto(): LoginDto {
        const loginDto: LoginDto = new LoginDto();
        loginDto.email = this.loginForm.get('email')?.value;
        loginDto.password = this.loginForm.get('password')?.value;
        
        return loginDto;
    }

    private manipulateSuccessLogin(loginResponse: LoginResponseProjection){ //UserDto
        this.router.navigate(['/home']);
        this.loading = false;
        
        console.log("userrrrr");
        console.log(loginResponse);
        
        
    }


    private manipulateErrorLogin(error: any): Observable<null>{
        console.log("error al iniciar sesión. ",JSON.stringify(error));
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Érror', detail: 'Hubo un error al intentar iniciar sesión,por favor intente nuevamente. Si el error persiste comunicarse inmediatamente con el administrador.' });
        this.loading = false;
        return of(null);
    }
}
