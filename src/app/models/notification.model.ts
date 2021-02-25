import { User } from "./User.model";

export class Notif {
  _id: number;
  type: 'new_review' | 'new_reply';
  createdAt: string;
  navUrl: string;
  text: string;
  user: number | User;
  review: number;
  seenDate?: string;
}