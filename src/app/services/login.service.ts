import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginDto } from '../models/dto/login-dto.model';
const LOGIN_URL = 'http://localhost:3000';
const LOGIN = LOGIN_URL + '/users/signin';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }
  
  public login(loginDto: LoginDto): Observable<any> {
    //console.log('el companyForm es: ');
    //console.log(companyDto);
    return this.http.post<any>(LOGIN,loginDto);
  }
}
