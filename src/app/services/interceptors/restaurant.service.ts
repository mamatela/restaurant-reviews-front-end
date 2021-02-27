import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/User.model';
import { PagingResponse } from 'src/app/models/pagingResponse.model';
import { Notif } from 'src/app/models/notification.model';
import { Restaurant } from 'src/app/models/restaurant.mode';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  constructor(
    private http: HttpClient,
  ) { }


  async addNewRestaurant(restaurant: { name: string, address: string }) {
    return await this.http.post<Restaurant>(`${environment.apiBaseUrl}/restaurants`, restaurant).toPromise();
  }

  async updateRestaurant(id: number, restaurantBody: { name: string, address: string }) {
    const options = {
      params: { _id: id.toString() }
    }
    return await this.http.patch<Restaurant>(`${environment.apiBaseUrl}/restaurants`, restaurantBody, options).toPromise();
  }

  async getRestaurants(paging: { pageNumber: number, pageSize: number, sort?: string }, filter: { avgRating?: number, searchString?: string } = {}) {
    const params: any = {
      pageNumber: paging.pageNumber.toString(),
      pageSize: paging.pageSize.toString(),
    }
    if (paging.sort) params.sort = paging.sort.toString();
    if (filter.avgRating) params.avgRating = filter.avgRating.toString();
    if (filter.searchString) params.searchString = filter.searchString.toString();
    return await this.http.get<PagingResponse<Restaurant>>(`${environment.apiBaseUrl}/restaurants/all`, { params }).toPromise();
  }

  async deleteRestaurant(id: number) {
    const params = { _id: id.toString() };
    await this.http.delete<Restaurant>(`${environment.apiBaseUrl}/restaurants`, { params }).toPromise();
  }
}
