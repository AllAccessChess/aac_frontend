import BaseAPIService from "./baseAPIService";

export default class AuthService extends BaseAPIService {
  login = (payload) => {
    return this.request("/auth/token", "POST", payload);
  };
  register = (payload) => {
    return this.request("/auth/register", "POST", payload);
  };
  resetPassword = (payload) => {
    return this.request("/auth/reset-password", "POST", payload);
  };
}
