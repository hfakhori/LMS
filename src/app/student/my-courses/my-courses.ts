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

  this.http.get<any[]>(`${this.baseUrl}/Enrollment/ByStudent/${studentId}`)
    .subscribe({
      next: (courses) => {
        this.myCourses = courses || [];
        this.totalItems = this.myCourses.length;
        this.applyPagination();
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Error loading my courses.';
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
