import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthResponseData, AuthResponseDataLogin, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {


  formGroup!: FormGroup
  isLoginMode: boolean = true;
  isLoading = false;
  error: string = '';


  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      "email": new FormControl(null, Validators.required),
      "password": new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
  }

  onSubmit() {
    if (!this.formGroup.valid) return;
    const { email, password } = this.formGroup.value;
    this.isLoading = true;

    if (!this.isLoginMode) {
      this.signUp(email, password);
    } else {
      this.login(email, password);
    }

    this.formGroup.reset();
  }

  private login(email: any, password: any) {
    this.authService.login(email, password)
      .subscribe((data: AuthResponseDataLogin) => {
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      }, (errorMessage: any) => {
        console.log(errorMessage);

        this.isLoading = false;
        this.error = errorMessage;
      });
  }

  private signUp(email: any, password: any) {
    this.authService.signup(email, password)
      .subscribe((data: AuthResponseData) => {
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      }, (errorMessage: any) => {
        this.isLoading = false;
        this.error = errorMessage;
      });
  }

  onChangeToLogin() {
    this.isLoginMode = !this.isLoginMode;
  }

  onHandleError(){
    this.error = '';
  }

}
