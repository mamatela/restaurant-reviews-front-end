import { User } from "./User.model";

export class Restaurant {
  _id: number;
  name: string;
  address: string;
  user: number | User;
  avgRating?: number;
  reviewCount?: number;
  pendingReviewCount?: number;
  distance?: number;
  starArray: Array<number>
}