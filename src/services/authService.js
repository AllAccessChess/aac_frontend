import BaseAPIService from "./baseAPIService";

export default class AuthService extends BaseAPIService {
  login = (payload) => {
    return this.requestCMSAPI("/auth/token", "POST", payload);
  };
  register = (payload) => {
    return this.requestLocalAPI("/auth/register", "POST", payload);
  };
  resetPassword = (payload) => {
    return this.requestLocalAPI("/auth/reset-password", "POST", payload);
  };
}
