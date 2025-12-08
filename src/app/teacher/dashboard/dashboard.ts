import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class TeacherDashboardComponent implements OnInit {

  private baseUrl = environment.apiUrl;

  teacherId: number = 0;

  courses: any[] = [];
  errorMessage: string = '';

  pageNumber: number = 1;
  pageSize: number = 5;
  totalItems: number = 0;

  showStudentsModal: boolean = false;
  selectedCourseId: number | null = null;
  selectedCourseStudents: any[] = [];

  constructor(
    private http: HttpClient,
    private auth: Auth,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const id = this.auth.getUserId();
    if (!id) {
      this.errorMessage = 'Teacher ID not found in token.';
      return;
    }

    this.teacherId = id;
    this.loadCourses();
  }

  get hasStudents(): boolean {
    return this.selectedCourseStudents && this.selectedCourseStudents.length > 0;
  }

  loadCourses() {
    this.errorMessage = '';

    this.http.get<any>(`${this.baseUrl}/Course/ByTeacher/${this.teacherId}`, {
      params: {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      }
    }).subscribe({
      next: (res) => {
        this.courses = res.items || [];
        this.totalItems = res.totalItems ?? 0;
        this.pageNumber = res.pageNumber ?? this.pageNumber;
        this.pageSize = res.pageSize ?? this.pageSize;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading courses', err);
        this.errorMessage = 'Error loading courses';
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadCourses();
  }

  viewStudents(courseId: number) {
    this.selectedCourseId = courseId;
    this.selectedCourseStudents = [];

    this.http.get<any[]>(`${this.baseUrl}/Enrollment/Course/${courseId}`)
      .subscribe({
        next: (students) => {
          this.showStudentsModal = true;
          this.selectedCourseStudents = students || [];
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading students for course', err);
          this.selectedCourseStudents = [];
        }
      });
  }

  closeStudentsModal() {
    this.showStudentsModal = false;
    this.selectedCourseStudents = [];
  }

  deleteCourse(courseId: number) {
    if (!confirm('Are you sure you want to delete this course?')) return;

    this.http.delete(`${this.baseUrl}/Course/${courseId}`)
      .subscribe({
        next: () => {
          this.loadCourses();
          alert('Course deleted');
        },
        error: (err) => {
          console.error('Delete course error', err);
          alert('Failed to delete course');
        }
      });
  }
}
