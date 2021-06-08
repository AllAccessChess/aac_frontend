import BaseAPIService from "./baseAPIService";

export default class UserService extends BaseAPIService {
  static getUser = (id_username_email) => {
    return this.requestWithAuth(`/user/${id_username_email}`, "GET");
  };
  static getUserList = () => {
    return this.requestWithAuth("/users", "GET");
  };
  static getUSCFData = (uscfID) => {
    return this.requestWithAuth(`/uscf/${uscfID}`, "GET");
  };
}
