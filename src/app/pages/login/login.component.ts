import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/interceptors/auth.service';
import extractMessage from 'src/app/utils/extract-error-message';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  email: string;
  password: string;
  hide = true;
  loginLoading = false;

  constructor(
    public router: Router,
    private authService: AuthService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  async login() {
    if (!(this.email && this.password && this.password.length > 7)) {
      return;
    }
    this.loginLoading = true;
    try {
      await this.authService.login(this.email, this.password);
    }
    catch (err) {
      this.snackbar.open(extractMessage(err), 'OK');
    }
    finally {
      this.loginLoading = false;
    }
  }

}
