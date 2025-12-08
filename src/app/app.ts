import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoginComponent } from './auth/login/login';
import { Auth } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, LoginComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  userName: string | null = null;
  userRole: string | null = null;

  constructor(private auth: Auth, private router: Router) {}

  ngOnInit(): void {
    this.refreshUserState();
  }

  private refreshUserState() {
    const token = this.auth.getToken();
    this.isLoggedIn = !!token;
    this.userName = this.auth.getUserName();
    this.userRole = this.auth.getUserRole();
  }

  onLoginSuccess() {
    this.refreshUserState();

    if (this.userRole === 'Student') {
      this.router.navigate(['/student']);
    } else if (this.userRole === 'Teacher') {
      this.router.navigate(['/teacher']);
    } else if (this.userRole === 'Admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/student']);
    }
  }

  logout() {
    this.auth.clearToken();
    this.isLoggedIn = false;
    this.userName = null;
    this.userRole = null;
    this.router.navigate(['/']);
  }
}
