import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { companyComponent } from './company.component';
import { SaveCompanyComponent } from './save-company/save-company.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: companyComponent },
        {path:'save-company', component: SaveCompanyComponent}

	])],
	exports: [RouterModule]
})
export class CompanyRoutingModule { }
