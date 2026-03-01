import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth-service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  standalone:true,
  imports:[ReactiveFormsModule,CommonModule]
})
export class LoginPageComponent  implements OnInit {



  ngOnInit() {}
    loginForm!: FormGroup;
  submitted = false;
  
  constructor(private fb: FormBuilder,private authService:AuthService ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    
    });
  }
  get f(): { [key: string]: any } {
  return this.loginForm.controls 
}

  onSubmit() {
     this.login(this.loginForm.value)

    console.log('Login Data:', this.loginForm.value);

    // 👉 yahin API call hogi
  }
  login(body:any){
    this.authService.login(body).subscribe({
      next:(res:any)=>{
      if(res){
        localStorage.setItem('token',res.body.token)
      }}
    })

  }
}
