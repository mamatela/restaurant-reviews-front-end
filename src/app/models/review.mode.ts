import { Restaurant } from "./restaurant.mode";
import { User } from "./User.model";

export class Review {
  _id: number;
  restaurant: number | Restaurant;
  rating: number;
  user: number | User;
  date: string;
  comment: string;
  reply?: string;
  replyDate?: string;
}