// admin.services.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:3000/admin/';
  private userUrl = 'http://localhost:3000/user';
  constructor(private http: HttpClient) {}

  getAllAdminData(token: string, limit?: number, offset?: number, sortBy?: string, username?: string): Observable<any[]> {
    let params = new HttpParams();
    
    // Check if limit and offset are provided, then add them to params
    if (limit !== undefined && offset !== undefined) {
        params = params
            .set('limit', limit.toString()) // Convert to string
            .set('offset', offset.toString()); // Convert to string
    }

    if (sortBy) {
        params = params.set('sortBy', sortBy);
    }
    if(username)
    {
      params = params.set('username', username);
    }
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any[]>(`${this.apiUrl}/view-all`, { headers, params });
}

  getUserById(id: any, token:string): Observable<any> 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.userUrl}/get-user/${id}`, {headers});
  }
  getFormById(id: any, token:string): Observable<any> 
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/form/${id}`, {headers});
  }
  editUserById(id: any,username:string, useremail:string, state:string, role:string, updatedby:string, token:string)
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch<any>(`${this.userUrl}/update-user/${id}`, {username, useremail, state, role, updatedby}, {headers})
  }
  deleteUserById(id: any, token:string){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.userUrl}/delete/${id}`, {headers});
  }

  createForm(token:string, {title, description, state, createdby, updatedby, version, formControls, isChecked,status})
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/add-form`, 
    {title, description, state, createdby, updatedby, version,formControls, isChecked,status},{headers});
    
  }

  createFormResponse(token: string, {formresponse, submittedby, formid}){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}submit-new-form/${formid}`,
    {formresponse, submittedby}, {headers})
  }
  getSubmittedForms(token:string, id:number){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/get-submitted-forms/${id}`, {headers});
  }
  getFormControls(token:string, id:number, formid:number){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/get-submitted-formcontrol/${id}/${formid}`, {headers});
  }

  getForms(token:string){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/form`, {headers});
  }
  deleteFormById(token:string, formid:number){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch<any>(`${this.apiUrl}delete-form/${formid}`,null, {headers});
  }
  getOtherSubmission(token:string, id:number){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/other-submissions/${id}`, {headers});
  }
}
