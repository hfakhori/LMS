import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class AdminDashboardComponent implements OnInit {

  private baseUrl = environment.apiUrl;

  students: any[] = [];
  studentErrorMessage: string = '';
  studentsPageNumber: number = 1;
  studentsPageSize: number = 5;
  studentsTotalItems: number = 0;

  teachers: any[] = [];
  teacherErrorMessage: string = '';
  teachersPageNumber: number = 1;
  teachersPageSize: number = 5;
  teachersTotalItems: number = 0;

  courses: any[] = [];
  courseErrorMessage: string = '';
  coursesPageNumber: number = 1;
  coursesPageSize: number = 5;
  coursesTotalItems: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadStudents();
    this.loadTeachers();
    this.loadCourses();
  }


  loadStudents() {
    this.studentErrorMessage = '';

    this.http.get<any>(`${this.baseUrl}/Student/paged`, {
      params: {
        pageNumber: this.studentsPageNumber,
        pageSize: this.studentsPageSize
      }
    }).subscribe({
      next: (res) => {
        this.students = res.items || [];
        this.studentsTotalItems = res.totalItems || 0;
        this.studentsPageNumber = res.pageNumber || this.studentsPageNumber;
        this.studentsPageSize = res.pageSize || this.studentsPageSize;
      },
      error: (err) => {
        console.error('Error loading students', err);
        this.studentErrorMessage = 'Error loading students';
        this.students = [];
        this.studentsTotalItems = 0;
      }
    });
  }

  onStudentsPageChange(event: PageEvent) {
    this.studentsPageNumber = event.pageIndex + 1;
    this.studentsPageSize = event.pageSize;
    this.loadStudents();
  }

  deleteStudent(id: number) {
    const confirmed = confirm('Are you sure you want to delete this student?');
    if (!confirmed) return;

    this.http.delete(`${this.baseUrl}/Student/${id}`)
      .subscribe({
        next: () => {
          this.loadStudents();
          alert('Student deleted successfully ✔');
        },
        error: (err) => {
          console.error('Error deleting student:', err);
          alert('Failed to delete student ');
        }
      });
  }


  loadTeachers() {
    this.teacherErrorMessage = '';

    this.http.get<any>(`${this.baseUrl}/Teacher/paged`, {
      params: {
        pageNumber: this.teachersPageNumber,
        pageSize: this.teachersPageSize
      }
    }).subscribe({
      next: (res) => {
        this.teachers = res.items || [];
        this.teachersTotalItems = res.totalItems || 0;
        this.teachersPageNumber = res.pageNumber || this.teachersPageNumber;
        this.teachersPageSize = res.pageSize || this.teachersPageSize;
      },
      error: (err) => {
        console.error('Error loading teachers:', err);
        this.teacherErrorMessage = 'Error loading teachers.';
        this.teachers = [];
        this.teachersTotalItems = 0;
      }
    });
  }

  onTeachersPageChange(event: PageEvent) {
    this.teachersPageNumber = event.pageIndex + 1;
    this.teachersPageSize = event.pageSize;
    this.loadTeachers();
  }

  deleteTeacher(id: number) {
    const confirmed = confirm('Are you sure you want to delete this teacher?');
    if (!confirmed) return;

    this.http.delete(`${this.baseUrl}/Teacher/${id}`)
      .subscribe({
        next: () => {
          this.loadTeachers();
          alert('Teacher deleted successfully ');
        },
        error: (err) => {
          console.error('Error deleting teacher:', err);
          alert('Failed to delete teacher ');
        }
      });
  }


  loadCourses() {
    this.courseErrorMessage = '';

    this.http.get<any>(`${this.baseUrl}/Course`, {
      params: {
        pageNumber: this.coursesPageNumber,
        pageSize: this.coursesPageSize
      }
    }).subscribe({
      next: (res) => {
        this.courses = res.items || [];
        this.coursesTotalItems = res.totalItems || 0;
        this.coursesPageNumber = res.pageNumber || this.coursesPageNumber;
        this.coursesPageSize = res.pageSize || this.coursesPageSize;
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        this.courseErrorMessage = 'Error loading courses.';
        this.courses = [];
        this.coursesTotalItems = 0;
      }
    });
  }

  onCoursesPageChange(event: PageEvent) {
    this.coursesPageNumber = event.pageIndex + 1;
    this.coursesPageSize = event.pageSize;
    this.loadCourses();
  }

  deleteCourse(id: number) {
    const confirmed = confirm('Are you sure you want to delete this course?');
    if (!confirmed) return;

    this.http.delete(`${this.baseUrl}/Course/${id}`)
      .subscribe({
        next: () => {
          this.loadCourses();
          alert('Course deleted successfully ');
        },
        error: (err) => {
          console.error('Error deleting course:', err);
          alert('Failed to delete course ');
        }
      });
  }
}
