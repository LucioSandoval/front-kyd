import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmployeeProjection } from '../models/projections/employee-projection.model';
import { Observable } from 'rxjs';
import { EmployeeDto } from '../models/dto/employee-dto.model';
const EMPLOYEE_URL = 'http://localhost:3000';
const LIST_EMPLOYEE = EMPLOYEE_URL + '/employees';
const SAVE_EMPLOYEE = EMPLOYEE_URL + '/employees/create';
const UPDATE_EMPLOYEE = EMPLOYEE_URL + '/employees/';
const FIND_BY_EMPLOYEE = EMPLOYEE_URL + '/employees/';
const DELETE_EMPLOYEE = EMPLOYEE_URL + '/employees/'
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

    public listEmployees(): Observable<EmployeeProjection[]>{
        const ruta = LIST_EMPLOYEE;
        return this.http.get<EmployeeProjection[]>(ruta);
    }

public findByRut(rut:string): Observable<EmployeeProjection>{
    console.log("en find one")
    //const params : HttpParams = new HttpParams()
    //.set(COMPANY_ID,id);

    return this.http.get<EmployeeProjection>(FIND_BY_EMPLOYEE+rut);
}

public saveEmployee(employeeDto: EmployeeDto): Observable<EmployeeDto> {
    console.log('el EmployeeDto es: ');
    console.log(employeeDto);
    return this.http.post<EmployeeDto>(SAVE_EMPLOYEE,employeeDto);
}

public updateEmployee( id: string, employeeDto: EmployeeDto): Observable<EmployeeDto> {
    debugger
    console.log('el employeeDto editado  es: ');
    console.log(employeeDto);
    const ruta = UPDATE_EMPLOYEE + id
    return this.http.patch<EmployeeDto>(ruta,employeeDto,);
}

public deleteEmployee(id: string): Observable<Object> {
    return this.http.delete<Object>(DELETE_EMPLOYEE+id);
} 

}
