import { Token } from "../Token.model";
import { User } from "../User.model";

export class AuthResponse { 
  user: User;
  tokens: { 
    access: Token;
    refresh: Token;
  } 
}