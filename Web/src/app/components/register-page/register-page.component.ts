import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserRegistration } from '../../../models/user/user-registration';
import { AuthToken } from '../../../services/auth/auth-token';
import { PasswordConfirmationValidator } from '../../../services/commons/password-confirmation-validator';
import { UserService } from '../../../services/user/user-service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit, OnChanges {
  title = 'User Registration';

  registerForm: FormGroup;
  alertMessage: string | null = null;
  alertSuccess: boolean = false;
  alertError: boolean = false;
  isUserLoggedIn: boolean = false;

  constructor(
    private passConfValidator: PasswordConfirmationValidator,
    private userService: UserService,
    private router: Router,
    private authToken: AuthToken
  ) {

    this.registerForm = new FormGroup({
      UserName: new FormControl('', [Validators.required, Validators.minLength(4)]),
      FirstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      LastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      Email: new FormControl('', [Validators.required, Validators.email]),
      Password: new FormControl('', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)]),
      ConfirmPassword: new FormControl('', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)]),
      ProfilePicName: new FormControl(''),
      ProfilePicUrl: new FormControl(''),
    });

    this.authToken.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });

  }

  ngOnInit(): void {

    this.authToken.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });

    this.registerForm.get('ConfirmPassword')!.setValidators([Validators.required,
    this.passConfValidator.validateConfirmPassword(this.registerForm.get('Password')!)]);

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.authToken.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });
  }

  protected validateControl = (controlName: string) => {
    return this.registerForm.get(controlName)!.invalid && this.registerForm.get(controlName)!.touched
  }

  protected hasError = (controlName: string, errorName: string) => {
    return this.registerForm.get(controlName)!.hasError(errorName)
  }

  protected registerUser = (registerFormValue: any) => {

    const formValues = { ...registerFormValue };

    const user: UserRegistration = {
      UserName: formValues.UserName,
      FirstName: formValues.FirstName,
      LastName: formValues.LastName,
      Email: formValues.Email,
      Password: formValues.Password,
      ConfirmPassword: formValues.ConfirmPassword
    };

    this.userService.register(user)
      .subscribe({
        next: (response) => {

          this.alertMessage = response.SystemMessage + " Redirecting...";
          this.alertSuccess = true;

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);

        },
        error: (err: HttpErrorResponse) => {


          this.alertMessage = err.message;
          this.alertError = true;

        }
      })

    this.alertMessage = null;
    this.alertSuccess = false;
    this.alertError = false;

  }
}
