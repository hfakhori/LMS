import { Component, Output, EventEmitter,ChangeDetectorRef} from '@angular/core';
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

  userType: string = 'student'; 
  email: string = '';
  password: string = '';
  message: string = '';

  constructor(private auth: Auth, private cdr:ChangeDetectorRef) {}

  onSubmit() {
    this.message = '';

    const data = {
      email: this.email,
      password: this.password
    };

    let login$;

    if (this.userType === 'student') {
      login$ = this.auth.loginStudent(data);
    } else if (this.userType === 'teacher') {
      login$ = this.auth.loginTeacher(data);
    } else {
      login$ = this.auth.loginAdmin(data);
    }

    login$.subscribe({
      next: (res: any) => {
        this.auth.saveToken(res.token);
        this.message = 'Login successful';

        this.loginSuccess.emit();
        this.cdr.detectChanges();
      },
      error: () => {
        this.message = 'Login failed check your email/password.';
      }
    });
  }
}
