import { Routes } from '@angular/router';
import { DashboardComponent } from './student/dashboard/dashboard';
import { MyCoursesComponent } from './student/my-courses/my-courses';
import { TeacherDashboardComponent } from './teacher/dashboard/dashboard';
import { AdminDashboardComponent } from './admin/dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'student', pathMatch: 'full' },

  { path: 'student', component: DashboardComponent },
  { path: 'student/my-courses', component: MyCoursesComponent },

  { path: 'teacher', component: TeacherDashboardComponent },

  { path: 'admin', component: AdminDashboardComponent }
];
