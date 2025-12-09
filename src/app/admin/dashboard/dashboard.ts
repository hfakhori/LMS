import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environments';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

interface Student {
  id: number;
  fullName: string;
  email: string;
}

interface Teacher {
  id: number;
  fullName: string;
  email: string;
}

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

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MatPaginatorModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class AdminDashboardComponent implements OnInit {

  private baseUrl = environment.apiUrl;

  // ---------- Students ----------
  students: Student[] = [];
  studentErrorMessage = '';
  studentsPageNumber = 1;
  studentsPageSize = 5;
  studentsTotalItems = 0;

  isStudentFormVisible = false;
  isEditingStudent = false;
  studentFormError = '';
  studentForm: { id: number | null; fullName: string; email: string } = {
    id: null,
    fullName: '',
    email: ''
  };

  // ---------- Teachers ----------
  teachers: Teacher[] = [];
  teacherErrorMessage = '';
  teachersPageNumber = 1;
  teachersPageSize = 5;
  teachersTotalItems = 0;

  isTeacherFormVisible = false;
  isEditingTeacher = false;
  teacherFormError = '';
  teacherForm: { id: number | null; fullName: string; email: string } = {
    id: null,
    fullName: '',
    email: ''
  };

  // ---------- Courses ----------
  courses: Course[] = [];
  courseErrorMessage = '';
  coursesPageNumber = 1;
  coursesPageSize = 5;
  coursesTotalItems = 0;

  isCourseFormVisible = false;
  isEditingCourse = false;
  courseFormError = '';
  courseForm: { id: number | null; title: string; description: string; teacherId: number | null } = {
    id: null,
    title: '',
    description: '',
    teacherId: null
  };

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadStudents();
    this.loadTeachers();
    this.loadCourses();
  }

  // ============= Students =============

  loadStudents(): void {
    this.studentErrorMessage = '';

    this.http.get<PaginatedResponse<Student>>(`${this.baseUrl}/Student/paged`, {
      params: {
        pageNumber: this.studentsPageNumber,
        pageSize: this.studentsPageSize
      } as any
    }).subscribe({
      next: (res) => {
        this.students = res.items || [];
        this.studentsTotalItems = res.totalItems || 0;
        this.studentsPageNumber = res.pageNumber || this.studentsPageNumber;
        this.studentsPageSize = res.pageSize || this.studentsPageSize;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading students', err);
        this.studentErrorMessage = 'Error loading students';
        this.students = [];
        this.studentsTotalItems = 0;
      }
    });
  }

  onStudentsPageChange(event: PageEvent): void {
    this.studentsPageNumber = event.pageIndex + 1;
    this.studentsPageSize = event.pageSize;
    this.loadStudents();
  }

  openCreateStudent(): void {
    this.isEditingStudent = false;
    this.studentFormError = '';
    this.studentForm = { id: null, fullName: '', email: '' };
    this.isStudentFormVisible = true;
  }

  openEditStudent(student: Student): void {
    this.isEditingStudent = true;
    this.studentFormError = '';
    this.studentForm = {
      id: student.id,
      fullName: student.fullName,
      email: student.email
    };
    this.isStudentFormVisible = true;
  }

  cancelStudentForm(): void {
    this.isStudentFormVisible = false;
    this.studentFormError = '';
  }

  submitStudentForm(): void {
    if (!this.studentForm.fullName.trim() || !this.studentForm.email.trim()) {
      this.studentFormError = 'Full name and email are required.';
      return;
    }

    const payload = {
      fullName: this.studentForm.fullName.trim(),
      email: this.studentForm.email.trim()
    };

    if (this.isEditingStudent && this.studentForm.id != null) {
      this.http.put(`${this.baseUrl}/Student/${this.studentForm.id}`, payload)
        .subscribe({
          next: () => {
            this.isStudentFormVisible = false;
            this.loadStudents();
            alert('Student updated successfully ✔');
          },
          error: (err) => {
            console.error('Error updating student:', err);
            this.studentFormError = 'Failed to update student.';
          }
        });
    } else {
      this.http.post<any>(`${this.baseUrl}/Student`, payload)
        .subscribe({
          next: (res) => {
            console.log("Student create response:", res);

            this.isStudentFormVisible = false;
            this.studentsPageNumber = 1;
            this.loadStudents();

            alert(
              `Student created successfully ✔\n\n` +
              `Email: ${res.email}\n` +
              `Default Password: ${res.defaultPassword}`
            );
          },
          error: (err) => {
            console.error('Error creating student:', err);
            this.studentFormError = 'Failed to create student.';
          }
        });
    }
  }

  deleteStudent(id: number): void {
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
          alert('Failed to delete student');
        }
      });
  }

  // ============= Teachers =============

  loadTeachers(): void {
    this.teacherErrorMessage = '';

    this.http.get<PaginatedResponse<Teacher>>(`${this.baseUrl}/Teacher/paged`, {
      params: {
        pageNumber: this.teachersPageNumber,
        pageSize: this.teachersPageSize
      } as any
    }).subscribe({
      next: (res) => {
        this.teachers = res.items || [];
        this.teachersTotalItems = res.totalItems || 0;
        this.teachersPageNumber = res.pageNumber || this.teachersPageNumber;
        this.teachersPageSize = res.pageSize || this.teachersPageSize;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading teachers:', err);
        this.teacherErrorMessage = 'Error loading teachers.';
        this.teachers = [];
        this.teachersTotalItems = 0;
      }
    });
  }

  onTeachersPageChange(event: PageEvent): void {
    this.teachersPageNumber = event.pageIndex + 1;
    this.teachersPageSize = event.pageSize;
    this.loadTeachers();
  }

  openCreateTeacher(): void {
    this.isEditingTeacher = false;
    this.teacherFormError = '';
    this.teacherForm = { id: null, fullName: '', email: '' };
    this.isTeacherFormVisible = true;
  }

  openEditTeacher(teacher: Teacher): void {
    this.isEditingTeacher = true;
    this.teacherFormError = '';
    this.teacherForm = {
      id: teacher.id,
      fullName: teacher.fullName,
      email: teacher.email
    };
    this.isTeacherFormVisible = true;
  }

  cancelTeacherForm(): void {
    this.isTeacherFormVisible = false;
    this.teacherFormError = '';
  }

  submitTeacherForm(): void {
    if (!this.teacherForm.fullName.trim() || !this.teacherForm.email.trim()) {
      this.teacherFormError = 'Full name and email are required.';
      return;
    }

    const payload = {
      fullName: this.teacherForm.fullName.trim(),
      email: this.teacherForm.email.trim()
    };

    if (this.isEditingTeacher && this.teacherForm.id != null) {
      this.http.put(`${this.baseUrl}/Teacher/${this.teacherForm.id}`, payload)
        .subscribe({
          next: () => {
            this.isTeacherFormVisible = false;
            this.loadTeachers();
            alert('Teacher updated successfully ✔');
          },
          error: (err) => {
            console.error('Error updating teacher:', err);
            this.teacherFormError = 'Failed to update teacher.';
          }
        });
    } else {
      this.http.post<any>(`${this.baseUrl}/Teacher`, payload)
        .subscribe({
          next: (res) => {
            console.log("Teacher create response:", res);

            this.isTeacherFormVisible = false;
            this.teachersPageNumber = 1;
            this.loadTeachers();

            alert(
              `Teacher created successfully ✔\n\n` +
              `Email: ${res.email}\n` +
              `Default Password: ${res.defaultPassword}`
            );
          },
          error: (err) => {
            console.error('Error creating teacher:', err);
            this.teacherFormError = 'Failed to create teacher.';
          }
        });
    }
  }

  deleteTeacher(id: number): void {
    const confirmed = confirm('Are you sure you want to delete this teacher?');
    if (!confirmed) return;

    this.http.delete(`${this.baseUrl}/Teacher/${id}`)
      .subscribe({
        next: () => {
          this.loadTeachers();
          alert('Teacher deleted successfully');
        },
        error: (err) => {
          console.error('Error deleting teacher:', err);
          alert('Failed to delete teacher');
        }
      });
  }

  // ============= Courses =============

  loadCourses(): void {
    this.courseErrorMessage = '';

    this.http.get<PaginatedResponse<Course>>(`${this.baseUrl}/Course`, {
      params: {
        pageNumber: this.coursesPageNumber,
        pageSize: this.coursesPageSize
      } as any
    }).subscribe({
      next: (res) => {
        this.courses = res.items || [];
        this.coursesTotalItems = res.totalItems || 0;
        this.coursesPageNumber = res.pageNumber || this.coursesPageNumber;
        this.coursesPageSize = res.pageSize || this.coursesPageSize;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        this.courseErrorMessage = 'Error loading courses.';
        this.courses = [];
        this.coursesTotalItems = 0;
      }
    });
  }

  onCoursesPageChange(event: PageEvent): void {
    this.coursesPageNumber = event.pageIndex + 1;
    this.coursesPageSize = event.pageSize;
    this.loadCourses();
  }

  openCreateCourse(): void {
    this.isEditingCourse = false;
    this.courseFormError = '';
    this.courseForm = { id: null, title: '', description: '', teacherId: null };
    this.isCourseFormVisible = true;
  }

  openEditCourse(course: Course): void {
    this.isEditingCourse = true;
    this.courseFormError = '';
    this.courseForm = {
      id: course.id,
      title: course.title,
      description: course.description,
      teacherId: course.teacherId
    };
    this.isCourseFormVisible = true;
  }

  cancelCourseForm(): void {
    this.isCourseFormVisible = false;
    this.courseFormError = '';
  }

  submitCourseForm(): void {
    if (!this.courseForm.title.trim() || this.courseForm.teacherId == null) {
      this.courseFormError = 'Title and Teacher are required.';
      return;
    }

    const payload = {
      title: this.courseForm.title.trim(),
      description: this.courseForm.description?.trim() || '',
      teacherId: this.courseForm.teacherId
    };

    if (this.isEditingCourse && this.courseForm.id != null) {
      this.http.put(`${this.baseUrl}/Course/${this.courseForm.id}`, payload)
        .subscribe({
          next: () => {
            this.isCourseFormVisible = false;
            this.loadCourses();
            alert('Course updated successfully ✔');
          },
          error: (err) => {
            console.error('Error updating course:', err);
            this.courseFormError = 'Failed to update course.';
          }
        });
    } else {
      this.http.post(`${this.baseUrl}/Course`, payload)
        .subscribe({
          next: () => {
            this.isCourseFormVisible = false;
            this.coursesPageNumber = 1;
            this.loadCourses();
            alert('Course created successfully ✔');
          },
          error: (err) => {
            console.error('Error creating course:', err);
            this.courseFormError = 'Failed to create course.';
          }
        });
    }
  }

  deleteCourse(id: number): void {
    const confirmed = confirm('Are you sure you want to delete this course?');
    if (!confirmed) return;

    this.http.delete(`${this.baseUrl}/Course/${id}`)
      .subscribe({
        next: () => {
          this.loadCourses();
          alert('Course deleted successfully');
        },
        error: (err) => {
          console.error('Error deleting course:', err);
          alert('Failed to delete course');
        }
      });
  }
}
