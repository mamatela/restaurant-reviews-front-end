import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/interceptors/auth.service';
import extractMessage from 'src/app/utils/extract-error-message';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  email: string;
  sendLinkLoading = false;
  sentOnce = false;

  constructor(
    public router: Router,
    private authService: AuthService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
  }

  async sendLink() {
    if (this.sentOnce) {
      this.sentOnce = false;
      this.email = null;
      return;
    }
    this.sendLinkLoading = true;
    try {
      await this.authService.forgotPassword(this.email);
      this.snackbar.open('Email sent. Please check your inbox for password reset instructions', 'OK');
      this.sentOnce = true;
    }
    catch (err) {
      this.snackbar.open(extractMessage(err), 'OK');
    }
    finally {
      this.sendLinkLoading = false;
    }
  }

}
