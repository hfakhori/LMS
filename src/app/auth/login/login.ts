import { Component, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  @Output() loginSuccess = new EventEmitter<void>();

  email: string = '';
  password: string = '';
  message: string = '';

  constructor(private auth: Auth, private cdr: ChangeDetectorRef) {}

  onSubmit() {
    this.message = '';

    const data = {
      email: this.email,
      password: this.password
    };

    this.auth.login(data).subscribe({
      next: (res: any) => {
        this.auth.saveToken(res.token);
        this.message = 'Login successful';

        this.loginSuccess.emit();
        this.cdr.detectChanges();
      },
      error: () => {
        this.message = 'Login failed check your email or password.';
        this.cdr.detectChanges();
      }
    });
  }
}
