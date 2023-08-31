import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeComponent } from './employee.component';
import { EmployeeRoutingModule } from './employee-routing.module';
import { AutoCompleteModule } from "primeng/autocomplete";
import { CalendarModule } from "primeng/calendar";
import { ChipsModule } from "primeng/chips";
import { DropdownModule } from "primeng/dropdown";
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from "primeng/inputnumber";
import { CascadeSelectModule } from "primeng/cascadeselect";
import { MultiSelectModule } from "primeng/multiselect";
import { InputTextareaModule } from "primeng/inputtextarea";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';

import { ToastModule } from 'primeng/toast';
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		EmployeeRoutingModule,
		AutoCompleteModule,
		CalendarModule,
		ChipsModule,
        ToastModule,
		DropdownModule,
		InputMaskModule,
		InputNumberModule,
		CascadeSelectModule,
		MultiSelectModule,
		InputTextareaModule,
		InputTextModule,
        PasswordModule,
        TableModule,
	],
	declarations: [EmployeeComponent]
})
export class EmployeeModule { }
