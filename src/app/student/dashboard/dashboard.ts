import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  courses: any[] = [];
  errorMessage: string = '';

  pageNumber: number = 1;
  pageSize: number = 5;
  totalItems: number = 0;
  totalPages: number = 0;

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private auth: Auth
  ) { }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses() {
    this.http.get(`${this.baseUrl}/Course?pageNumber=${this.pageNumber}&pageSize=${this.pageSize}`)
      .subscribe({
        next: (res: any) => {
          this.courses = res.items || [];
          this.totalItems = res.totalItems;
          this.totalPages = res.totalPages;
        },
        error: () => {
          this.errorMessage = "Error loading courses.";
        }
      });
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1; 
    this.pageSize = event.pageSize;
    this.loadCourses();
  }

  enroll(courseId: number): void {
    const studentId = this.auth.getUserId(); 

    if (!studentId) {
      alert('Student ID not found in token ');
      return;
    }

    this.http.post(`${this.baseUrl}/Enrollment`, {
      studentId: studentId,
      courseId: courseId
    }).subscribe({
      next: () => alert('Enrolled successfully '),
      error: (err: any) => {
        console.error('Enroll error:', err);
        alert('Failed to enroll ');
      }
    });
  }
}
