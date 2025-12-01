import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet, RouterLink } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { Auth } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    RouterOutlet,
    RouterLink,
    LoginComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  isLoggedIn: boolean = false;
  userName: string | null = null;
  userRole: string | null = null;

  constructor(private auth: Auth) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;

    if (this.isLoggedIn) {
      this.userName = this.auth.getUserName();
      this.userRole = this.auth.getUserRole();
    }
  }

  onLoginSuccess() {
    this.isLoggedIn = true;
    this.userName = this.auth.getUserName();
    this.userRole = this.auth.getUserRole();
  }

  logout() {
    this.auth.clearToken();
    this.isLoggedIn = false;
    this.userName = null;
    this.userRole = null;
  }
}
