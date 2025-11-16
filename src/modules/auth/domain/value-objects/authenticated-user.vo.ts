import { User } from "src/modules/user/domain/user.entity";

export interface AuthenticatedRequestVO extends Request {
  user: User;
}