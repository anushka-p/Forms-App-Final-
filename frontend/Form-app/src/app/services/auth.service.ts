import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    loggedIn: boolean = false;
  private apiUrl = 'http://localhost:3000/auth';
  private gogUrl = 'http://localhost:3000/gog';
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password });
  }
  register(username: string, useremail: string, password: string, state:string, role:string,createdby:string, updatedby:string)
  {
    return this.http.post<any>(`${this.apiUrl}/signup`, {useremail, password, state, role, username,createdby,updatedby})
  }
  registerWithGoogle(): Observable<any> {
    return this.http.get<any>(`${this.gogUrl}/auth/google`)
  }
  
}
