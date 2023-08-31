import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmployeeProjection } from '../models/projections/employe-projection.model';
import { Observable } from 'rxjs';
const EMPLOYEE_URL = 'http://localhost:3000';
const LIST_EMPLOYEE = EMPLOYEE_URL + '/employees/';
const SAVE_COMPANY = EMPLOYEE_URL + '/employees/create';
const UPDATE_COMPANY = EMPLOYEE_URL + '/employees/';
const FIND_BY_COMPANY = EMPLOYEE_URL + '/employees/';
const DELETE_COMPANY = EMPLOYEE_URL + '/employees/'
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

    public listEmployees(): Observable<any[]>{
        debugger
        const ruta = LIST_EMPLOYEE;
        return this.http.get<any[]>(ruta);
    }

/* public findById(id:string): Observable<CompanyProjection>{
    console.log("en find one")
    const params : HttpParams = new HttpParams()
    //.set(COMPANY_ID,id);

    return this.http.get<CompanyProjection>(FIND_BY_COMPANY+id);
}

public saveCompany(companyDto: CompanyDto): Observable<CompanyDto> {
    console.log('el companyForm es: ');
    console.log(companyDto);
    return this.http.post<CompanyDto>(SAVE_COMPANY,companyDto);
}

public updateCompany( id: string, companyDto: CompanyDto): Observable<CompanyDto> {
    console.log('el companyForm editado  es: ');
    console.log(companyDto);
    return this.http.patch<CompanyDto>(UPDATE_COMPANY + id,companyDto,);
}

public deleteCompany(id: string): Observable<Object> {
    return this.http.delete<Object>(DELETE_COMPANY+id);
} */

}
