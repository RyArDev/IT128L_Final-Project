import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../models/user/user';
import { UserUpdate } from '../../../models/user/user-update';
import { AuthToken } from '../../../services/auth/auth-token';
import { PasswordConfirmationValidator } from '../../../services/commons/password-confirmation-validator';
import { ReloadComponent } from '../../../services/commons/reload-component';
import { ImageUpload } from '../../../services/file-upload/image-upload';
import { UserService } from '../../../services/user/user-service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit, OnChanges{

  title = "User Profile"

  updateUserForm: FormGroup;

  isUserLoggedIn: boolean = false;
  alertMessage: string | null = null;
  alertSuccess: boolean = false;
  alertError: boolean = false;

  user: User = {
    Id: -1,
    UserName: "N/A",
    FirstName: "N/A",
    LastName: "N/A",
    Email: "N/A",
    ProfilePicName: "N/A",
    ProfilePicUrl: "",
    RefreshToken: "N/A"
  };

  constructor(
    private authToken: AuthToken,
    private userService: UserService,
    private passConfValidator: PasswordConfirmationValidator,
    public imageUpload: ImageUpload,
    private commonReload: ReloadComponent
  ) {

    this.authToken.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });

    this.updateUserForm = new FormGroup({
      Id: new FormControl(-1),
      UserName: new FormControl('', [Validators.required, Validators.minLength(4)]),
      FirstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      LastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      Email: new FormControl('', [Validators.required, Validators.email]),
      Password: new FormControl('', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)]),
      ConfirmPassword: new FormControl('', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)]),
      ProfilePicName: new FormControl(''),
      ProfilePicUrl: new FormControl(''),
    });

  }

  ngOnInit(): void {
    this.authToken.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });

    this.GetUserProfile();

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.authToken.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });
  }

  public validateControl = (controlName: string) => {
    return this.updateUserForm.get(controlName)!.invalid && this.updateUserForm.get(controlName)!.touched
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.updateUserForm.get(controlName)!.hasError(errorName)
  }

  GetUserProfile(): void {

    if (this.isUserLoggedIn) {

      this.userService.getById(this.authToken.getUserId()).subscribe({
        next: (response) => {

          this.user = response.User!;

          //this.alertMessage = response.SystemMessage!;
          //this.alertSuccess = true;

        },
        error: (err: HttpErrorResponse) => {

          this.alertMessage = err.message;
          this.alertError = true;

        }
      })

    }

    this.alertMessage = null;
    this.alertSuccess = false;
    this.alertError = false;

  }

  public initializeUpdateForm() {

    this.updateUserForm = new FormGroup({
      Id: new FormControl(this.authToken.getUserId()),
      UserName: new FormControl(this.user.UserName, [Validators.required, Validators.minLength(4)]),
      FirstName: new FormControl(this.user.FirstName, [Validators.required, Validators.minLength(3)]),
      LastName: new FormControl(this.user.LastName, [Validators.required, Validators.minLength(3)]),
      Email: new FormControl(this.user.Email, [Validators.required, Validators.minLength(3)]),
      Password: new FormControl('', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)]),
      ConfirmPassword: new FormControl('', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)]),
      ProfilePicName: new FormControl(''),
      ProfilePicUrl: new FormControl('')
    });

    this.updateUserForm.get('ConfirmPassword')!.setValidators([Validators.required,
    this.passConfValidator.validateConfirmPassword(this.updateUserForm.get('Password')!)]);

  }

  public updateUser = (updateUserFormValue: any) => {

    const formValues = { ...updateUserFormValue };

    const updatedUser: UserUpdate = {
      Id: this.authToken.getUserId(),
      UserName: formValues.UserName,
      FirstName: formValues.FirstName,
      LastName: formValues.LastName,
      Email: formValues.Email,
      Password: formValues.Password,
      ProfilePicName: this.imageUpload.imageName,
      ProfilePicUrl: this.user.ProfilePicUrl
    };

    if (this.imageUpload.imageSrc.name !== "" || this.imageUpload.imageSrc.type !== "") {

      this.imageUpload.uploadProfilePicture(this.imageUpload.imageSrc!, this.authToken.getUserId()).subscribe({
        next: (response) => {

        },
        error: (err: HttpErrorResponse) => {

          this.alertMessage = err.message;
          this.alertError = true;

        }
      })

    }

    this.userService.update(updatedUser).subscribe({
      next: (response) => {

        this.alertMessage = response.SystemMessage!;
        this.alertSuccess = true;

        setTimeout(() => {
          this.commonReload.reloadComponent(true);
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
