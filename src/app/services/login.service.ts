import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginDto } from '../models/dto/login-dto.model';
import { LoginResponseProjection } from '../models/projections/login-response-projection.model';
const LOGIN_URL = 'http://localhost:3000';
const LOGIN = LOGIN_URL + '/users/signin';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }
  
  public login(loginDto: LoginDto): Observable<LoginResponseProjection> {
    //console.log('el companyForm es: ');
    //console.log(companyDto);
    return this.http.post<LoginResponseProjection>(LOGIN,loginDto);
  }
}
