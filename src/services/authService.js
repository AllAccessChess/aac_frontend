import BaseAPIService from "./baseAPIService";

export default class AuthService extends BaseAPIService {
  static login = (payload) => {
    return this.request("/auth/login", "POST", payload);
  };
  static register = (payload) => {
    return this.request("/auth/register", "POST", payload);
  };
  static renew = () => {
    return this.requestWithAuth("/auth/renew", "GET");
  };
  static resetPassword = (payload) => {
    return this.request("/auth/reset-password", "POST", payload);
  };
}
