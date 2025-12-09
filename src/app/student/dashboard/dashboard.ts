import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Auth } from '../../services/auth';

interface Course {
  id: number;
  title: string;
  description: string;
  teacherId: number;
}

interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages?: number;
}

interface Enrollment {
  id: number;
  studentId: number;
  courseId: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  courses: Course[] = [];
  errorMessage = '';

  pageNumber = 1;
  pageSize = 5;
  totalItems = 0;
  totalPages = 0;

  private enrolledCourseIds = new Set<number>();

  loading = false;

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private auth: Auth,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadStudentData();
  }

  private loadStudentData(): void {
    const studentId = this.auth.getUserId();

    if (!studentId) {
      this.errorMessage = 'Student ID not found in token.';
      return;
    }

    // نجيب الكورسات + التسجيلات
    this.loadEnrollments(studentId);
    this.loadCourses();
  }

  private loadEnrollments(studentId: number): void {
    this.http.get<Enrollment[]>(`${this.baseUrl}/Enrollment`)
      .subscribe({
        next: (enrollments) => {
          const myEnrollments = enrollments.filter(e => e.studentId === studentId);
          this.enrolledCourseIds = new Set(myEnrollments.map(e => e.courseId));
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading enrollments:', err);
        }
      });
  }

  loadCourses(): void {
    this.loading = true;
    this.errorMessage = '';

    this.http
      .get<PaginatedResponse<Course>>(
        `${this.baseUrl}/Course?pageNumber=${this.pageNumber}&pageSize=${this.pageSize}`
      )
      .subscribe({
        next: (res) => {
          this.courses = res.items || [];
          this.totalItems = res.totalItems;
          this.totalPages = (res as any).totalPages ?? 0;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading courses:', err);
          this.errorMessage = 'Error loading courses.';
          this.loading = false;
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadCourses();
  }

  isCourseEnrolled(courseId: number): boolean {
    return this.enrolledCourseIds.has(courseId);
  }

  enroll(courseId: number): void {
    const studentId = this.auth.getUserId();

    if (!studentId) {
      alert('Student ID not found in token.');
      return;
    }

    if (this.isCourseEnrolled(courseId)) {
      alert('You are already enrolled in this course.');
      return;
    }

    this.http.post(`${this.baseUrl}/Enrollment`, {
      studentId: studentId,
      courseId: courseId
    }).subscribe({
      next: () => {
        alert('Enrolled successfully ✔');
        this.enrolledCourseIds.add(courseId);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Enroll error:', err);
        const msg = err.error || 'Failed to enroll.';
        alert(msg);
      }

    });
  }
}
