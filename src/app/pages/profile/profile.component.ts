import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthResponse } from 'src/app/models/response-models/auth.response.model';
import { AuthService } from 'src/app/services/interceptors/auth.service';
import { UserService } from 'src/app/services/interceptors/user.service';
import extractMessage from '../../utils/extract-error-message';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user;
  saveLoading = false;
  
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private snackbar: MatSnackBar,
    public router: Router
  ) { 
    
  }

  async ngOnInit(): Promise<void> {
    this.authService.getAuthDataObservable().subscribe(async (authData: AuthResponse) => {
      if (authData) {
        this.user = authData.user;
      }
      else {
        this.user = null;
      }
    });
  }

  async updateProfile() {
    this.saveLoading = true;
    try {
      this.userService.editProfile(this.user);
      this.snackbar.open('Profile updated successfully', 'OK');
    }
    catch (err) {
      this.snackbar.open(extractMessage(err), 'OK');
    }
    finally {
      this.saveLoading = false;
    }
  }
}
