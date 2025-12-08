import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from './services/auth';

const redirectToLogin = () => {
  const router = inject(Router);
  router.navigate(['/']);
  return false;
};

// 🔹 يسمح بس للـ Student
export const studentGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const role = auth.getUserRole();
  if (role === 'Student') return true;
  return redirectToLogin();
};

// 🔹 يسمح بس للـ Teacher
export const teacherGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const role = auth.getUserRole();
  if (role === 'Teacher') return true;
  return redirectToLogin();
};

// 🔹 يسمح بس للـ Admin
export const adminGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const role = auth.getUserRole();
  if (role === 'Admin') return true;
  return redirectToLogin();
};
