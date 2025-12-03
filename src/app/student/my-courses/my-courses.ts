import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { Auth } from '../../services/auth';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule],
  templateUrl: './my-courses.html',
  styleUrl: './my-courses.css'
})
export class MyCoursesComponent implements OnInit {

  myCourses: any[] = [];
  pagedCourses: any[] = [];

  pageNumber: number = 1;
  pageSize: number = 5;
  totalItems: number = 0;

  errorMessage: string = '';

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private auth: Auth,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMyCourses();
  }

  loadMyCourses(): void {
    const studentId = this.auth.getUserId();

    if (!studentId) {
      this.errorMessage = 'Student ID not found in token.';
      return;
    }

    this.http.get<any[]>(`${this.baseUrl}/Enrollment`)
      .subscribe({
        next: (enrollments) => {
          const myEnrollments = enrollments.filter(e => e.studentId === studentId);
          const courseIds: number[] = myEnrollments.map(e => e.courseId);

          if (courseIds.length === 0) {
            this.myCourses = [];
            this.pagedCourses = [];
            this.totalItems = 0;
            this.cdr.detectChanges();
            return;
          }

          this.http.get<any>(`${this.baseUrl}/Course?pageNumber=1&pageSize=200`)
            .subscribe({
              next: (res) => {
                const allCourses = res.items || res;
                this.myCourses = allCourses.filter((c: any) => courseIds.includes(c.id));

                this.totalItems = this.myCourses.length;

                this.applyPagination();
                this.cdr.detectChanges();
              },
              error: () => {
                this.errorMessage = 'Error loading courses data.';
              }
            });
        },
        error: () => {
          this.errorMessage = 'Error loading enrollments.';
        }
      });
  }

  applyPagination() {
    const startIndex = (this.pageNumber - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedCourses = this.myCourses.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.applyPagination();
  }
}
