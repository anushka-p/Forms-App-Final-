// admin-home.component.ts
import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.services';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
})
export class AdminHomeComponent implements OnInit {
  users: any[] = [];
  p:any;
  //Sorting
  sortColumn: string = '';
  sortDirection: string = '';
  sortParam: string = '';
  currentPage: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 5;
  offset: number = 0;
  username: string = '';

  constructor(private adminService: AdminService, private route: Router) {}
  ngOnInit() {
    this.currentPage = 1;
    this.itemsPerPage = 5;
    this.fetchData(); // Fetch data initially
  }
  
  fetchData() {
    const token = localStorage.getItem('token');
    if (token) {
      if(this.sortColumn === '' && this.sortDirection === '')
      {
        this.sortParam = undefined;
      }else{
        this.sortParam = `${this.sortColumn}:${this.sortDirection}`;
      }
      if(this.username === '')
      {
        this.username = undefined;
      }
      this.offset = ((this.currentPage - 1) * this.itemsPerPage);
      this.adminService
        .getAllAdminData(token, this.itemsPerPage, this.offset , this.sortParam, this.username)
        .pipe(
          catchError((error) => {
            console.error('Error fetching admin data:', error);
            return throwError(() => new Error('test'));
          })
        )
        .subscribe((response: any) => {
          if (Array.isArray(response.data)) {
            this.users = response.data;
            this.totalItems = response.totalItems; 
            this.filteredUsers = [...this.users];            
          } else {
            console.error('invalid response from api');
          }
        });
    }
  }
  
  filteredUsers: any = [];
  applyFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement ? inputElement.value : '';
    this.username = filterValue;
    this.fetchData();    

  }
  
  deleteUser(id: any) {
    const confirmDelete = confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;
    const token = localStorage.getItem('token');
    if (token) {
      this.adminService.deleteUserById(id, token).subscribe({
        next: (response) => {
          console.log(response);
          this.users = this.users.filter((user) => user.id !== id);
          this.filteredUsers = [...this.users];
        },
      });
    }
  }
  
  // Function to handle column header click for sorting
  onSort(column: string) {
    // Toggle sorting direction if it's the same column, otherwise set to 'asc'
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.fetchData(); // Fetch data after sorting parameters are updated
  }

  onPageChange(page: number) {
    this.currentPage = page;
    console.log(this.currentPage);
    
    this.fetchData();
  }

  clearSearchField()
  {
    this.username = '';
    this.fetchData();
  }
}
