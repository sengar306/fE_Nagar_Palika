import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth-service';
import { ErrorAlertComponent } from 'src/app/shared/ui/error-alert/error-alert.component';
import { ErrorMessageService } from 'src/app/shared/services/error-message.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ErrorAlertComponent],
})
export class LoginPageComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  loginError = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private errorMessageService: ErrorMessageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {}

  get f(): { [key: string]: any } {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.loginError = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.login(this.loginForm.value);
  }

  login(body: any) {
    this.authService.login(body).subscribe({
      next: (res: any) => {
        if (res?.body?.token) {
          this.authService.setTokenData(res.body.token);
          this.router.navigateByUrl('/home/dashboard');
        }
      },
      error: (err) => {
        this.loginError = this.errorMessageService.getMessage(
          err,
          'Sign-in failed. Please verify your credentials and try again.'
        );
      },
    });
  }
}
