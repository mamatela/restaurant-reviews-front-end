import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthResponse } from './models/response-models/auth.response.model';
import { AuthService } from './services/interceptors/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'restaurant-review-front-end';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  async ngOnInit() {
    let authData: AuthResponse = await this.authService.autoAuthUsingRefreshToken();
    if (!authData) {
      setTimeout(() => { // gotta throw it to the end of the event queue for router to get the url right;
        if (!~['/login', '/register', '/forgot-password', '/reset-password'].indexOf(this.router.url)) {
          this.router.navigate(['/login']);
        }
      });
    }

  }
}
