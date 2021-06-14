import BaseAPIService from "./baseAPIService";

export default class UserService extends BaseAPIService {
  static getUser = (id_username_email) => {
    return this.requestWithAuth(`/users/get/${id_username_email}`, "GET");
  };
  static getMe = () => {
    return this.requestWithAuth(`/users/me`, "GET");
  };
  static getAllUsers = () => {
    return this.requestWithAuth("/users/all", "GET");
  };
  static getUSCFData = (uscfID) => {
    return this.requestWithAuth(`/uscf/get/${uscfID}`, "GET");
  };
}
