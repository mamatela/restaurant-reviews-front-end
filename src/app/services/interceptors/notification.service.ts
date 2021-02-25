import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/User.model';
import { PagingResponse } from 'src/app/models/pagingResponse.model';
import { Notif } from 'src/app/models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(
    private http: HttpClient,
  ) { }

  async getAllNotifs(pageNumber: number = 1, pageSize: number = 10) {
    const options = {
      params: {pageNumber: pageNumber.toString(), pageSize: pageSize.toString()}
    }
    return await this.http.get<PagingResponse<Notif>>(`${environment.apiBaseUrl}/notifications/own`, options).toPromise();
  }

  async setSeen() {
    return await this.http.patch<PagingResponse<Notif>>(`${environment.apiBaseUrl}/notifications/own`, {}).toPromise();
  }

}
