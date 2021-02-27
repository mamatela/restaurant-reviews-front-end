import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/interceptors/auth.service';
import extractMessage from 'src/app/utils/extract-error-message';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  password: string;
  repeatPassword: string;
  hide = true;
  setComplete = false;
  setPasswordLoading = false;

  constructor(
    public router: Router,
    private authService: AuthService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
  }


  async setPassword() {
    if (!(this.password && this.repeatPassword && this.password.length > 7 && this.repeatPassword.length > 7)) {
      return;
    }
    if (this.password !== this.repeatPassword) {
      this.snackbar.open('Passwords do not match', 'OK');
      return;
    }
    this.setPasswordLoading = true;
    try {
      let token = this.router.url.split('?token=')[1];
      await this.authService.resetPassword(this.password, token);
      this.snackbar.open('Password was successfuly set. You may log in now.', 'OK');
      this.setComplete = true;
    }
    catch (err) {
      this.snackbar.open(extractMessage(err), 'OK');
    }
    finally {
      this.setPasswordLoading = false;
    }
  }

}
