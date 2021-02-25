import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/User.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient,
  ) { }


  async editProfile(user: User) {
    const options = {
      params: { _id: user._id.toString() }
    }
    let u = {
      ...user,
      _id: undefined,
      role: undefined,
    }
    return await this.http.patch<User>(`${environment.apiBaseUrl}/users`, u, options).toPromise();
  }

}
