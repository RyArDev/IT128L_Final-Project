import { User } from "../user/user";
import { UserLogin } from "../user/user-login";
import { UserRefresh } from "../user/user-refresh";
import { UserRegistration } from "../user/user-registration";
import { UserUpdate } from "../user/user-update";

export interface HttpResponse {
  SystemMessage?: string;
  AccessToken?: string;
  User?: User;
  Users?: User[];
  UserLogin?: UserLogin;
  UserRegistration?: UserRegistration;
  UserUpdate?: UserUpdate;
  UserRefresh?: UserRefresh;
}
