import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EmployeeComponent } from './employee.component';
import { SaveEmployeeComponent } from './save-employee/save-employee.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: EmployeeComponent },
		
        {path:'save-employee', component: SaveEmployeeComponent}
	])],
	exports: [RouterModule]
})
export class EmployeeRoutingModule { }
