import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { PagingResponse } from 'src/app/models/pagingResponse.model';
import { AuthResponse } from 'src/app/models/response-models/auth.response.model';
import { Restaurant } from 'src/app/models/restaurant.mode';
import { User } from 'src/app/models/User.model';
import { AuthService } from 'src/app/services/interceptors/auth.service';
import { RestaurantService } from 'src/app/services/interceptors/restaurant.service';
import extractMessage from 'src/app/utils/extract-error-message';
import round from 'src/app/utils/math';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css']
})
export class RestaurantsComponent implements OnInit, OnDestroy {
  user: User;
  restaurantsResult: PagingResponse<Restaurant>;
  getRestaurantsLoading = false;
  deleteLoading = false;
  restaurantsNotFound = false;

  sort = 'rating';
  searchString: string;
  searchStringSubject = new BehaviorSubject<string>(null);
  searchStringSubscription: Subscription;

  ratingFilterValue: number = null;

  lat = 41.707106;
  long = 44.735420;

  constructor(
    private authService: AuthService,
    public restaurantService: RestaurantService,
    private snackbar: MatSnackBar,
    public router: Router,
  ) { }

  async ngOnInit(): Promise<void> {
    this.authService.getAuthDataObservable().subscribe(async (authData: AuthResponse) => {
      if (!authData) {
        this.user = null;
        return;
      }

      this.user = authData.user;
      this.refreshRestaurants();
    });

    this.searchStringSubscription = this.searchStringSubject.pipe(debounceTime(500)).subscribe(newValue => {
      this.refreshRestaurants();
    })
  }

  onSearchBoxValueChange(newValue) {
      this.searchString = newValue;
      this.searchStringSubject.next(newValue);
  }

  onRatingSliderValueChange(newValue) {
    console.log(newValue);
    this.searchStringSubject.next(newValue);
  }

  async refreshRestaurants() {
    this.getRestaurantsLoading = true;
    try {
      let sort = this.sort == 'rating' ? '-avgRating' : this.sort;
      let filter = { searchString: this.searchString, avgRating: this.ratingFilterValue };

      let res = await this.restaurantService.getRestaurants({ pageNumber: 1, pageSize: 10, sort }, filter);

      res.items = res.items.map(e => {
        e.starArray = Array(5).fill(0).map((_, i) => (i + 1) <= e.avgRating ? 2 : ((i < e.avgRating && (i + 1) > e.avgRating) ? 1 : 0));
        // e.distance = round(Math.random() * 10, 2);
        return e;
      });

      this.restaurantsResult = res;
      this.restaurantsNotFound = false;
    }
    catch (err) {
      this.restaurantsResult = null;
      this.restaurantsNotFound = true;
      if (!(err.error && err.error.code == 404)) {
        this.snackbar.open(extractMessage(err), 'OK');
      }
    }
    finally {
      this.getRestaurantsLoading = false;
    }
  }

  async resetFilters() {
    this.searchString = null;
    this.ratingFilterValue = null;
  }

  openDetailsPage(restaurant: Restaurant) {
    this.router.navigate(['/restaurants', restaurant._id]);
  }

  async deleteRestaurant(restaurant: Restaurant) {
    this.deleteLoading = true;
    try {
      await this.restaurantService.deleteRestaurant(restaurant._id);
      this.restaurantsResult.items = this.restaurantsResult.items.filter(e => e._id !== restaurant._id);
      this.snackbar.open('Restaurant deleted successfully', 'OK');
    }
    catch (err) {
      this.snackbar.open(extractMessage(err), 'OK')
    }
    finally {
      this.deleteLoading = false;
    }
  }

  formatSliderLabel(value) {
    return `${round(value/2, 1)}`;
  }

  ngOnDestroy() {
    this.searchStringSubscription.unsubscribe();
  }
}
