import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyDto } from 'src/app/models/dto/company-dto.model';
import { CompanyProjection } from '../models/projections/company-projection.model';

const EMPRESA_URL = 'http://localhost:3000';
const LIST_EMPRESA = EMPRESA_URL + '/company/all';
const SAVE_COMPANY = EMPRESA_URL + '/company/create';
const UPDATE_COMPANY = EMPRESA_URL + '/company/';
const FIND_BY_COMPANY = EMPRESA_URL + '/company/';
const DELETE_COMPANY = EMPRESA_URL + '/company/'
//const COMPANY_ID = 'id';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {


    constructor(private http: HttpClient) { }

    public listCompany(): Observable<CompanyProjection[]>{
        return this.http.get<CompanyProjection[]>(LIST_EMPRESA);
    }

    public findById(id:string): Observable<CompanyProjection>{
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
        return this.http.put<CompanyDto>(UPDATE_COMPANY + id,companyDto,);
    }

    public deleteCompany(id: string): Observable<Object> {

        return this.http.get<Object>(DELETE_COMPANY+id);
    }

}
