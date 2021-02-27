import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/interceptors/auth.service';
import { Notif } from '../models/notification.model';
import { PagingResponse } from '../models/pagingResponse.model';
import { AuthResponse } from '../models/response-models/auth.response.model';
import { User } from '../models/User.model';
import { NotificationService } from '../services/interceptors/notification.service';
import extractMessage from '../utils/extract-error-message';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  user: User;
  newNotifCount = 0;
  notifsResult: PagingResponse<Notif>;
  notifsLoading = false;

  constructor(
    private authService: AuthService,
    private notifService: NotificationService,
    private snackbar: MatSnackBar,
    public router: Router
  ) { }

  async ngOnInit() {
    // await this.authService.login('mamatela@gmail.com', 'string123');
    this.authService.getAuthDataObservable().subscribe(async (authData: AuthResponse) => {
      if (authData && authData.user) {
        this.user = authData.user;
        this.getNotifs();
      }
      else {
        this.user = null;
      }
    });


  }

  async getNotifs(setSeen = false) {
    this.notifsLoading = true;
    try {
      this.notifsResult = await this.notifService.getAllNotifs();
      this.newNotifCount = this.notifsResult.items.reduce((a, e) => a + Number(!e.seenDate), 0);
      if (setSeen) {
        this.notifService.setSeen();
        this.newNotifCount = 0;
      }
    }
    catch (err) {
      // this.snackbar.open(extractMessage(err), 'OK');
    }
    finally {
      this.notifsLoading = false;
    }
  }

  async logout() {
    this.authService.logout();
  }
}
