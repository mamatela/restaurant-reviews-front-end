import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/interceptors/auth.service';
import extractMessage from 'src/app/utils/extract-error-message';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  email: string;
  password: string;
  hide = true;
  firstName: string;
  lastName: string;
  isOwner = false;
  registerLoading = false;

  constructor(
    public router: Router,
    private authService: AuthService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  async register() {
    if (!(this.email && this.password && this.password.length > 7 && this.firstName && this.lastName)) {
      return;
    }
    this.registerLoading = true;
    try {
      await this.authService.register({
        email: this.email,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName,
        role: this.isOwner ? 'owner' : 'customer',
      });
      this.snackbar.open('SUCCESS!', 'OK');
    }
    catch (err) {
      this.snackbar.open(extractMessage(err), 'OK');
    }
    finally {
      this.registerLoading = false;
    }
  }
}
