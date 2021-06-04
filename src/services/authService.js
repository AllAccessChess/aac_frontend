import BaseAPIService from "./baseAPIService";

export default class AuthService extends BaseAPIService {
  static login = (payload) => {
    return this.request("/login", "POST", payload);
  };
  static register = (payload) => {
    return this.request("/register", "POST", payload);
  };
  static resetPassword = (payload) => {
    return this.request("/reset-password", "POST", payload);
  };
}
