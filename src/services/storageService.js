export default class StorageService {
  static getAuthToken = () => {
    return localStorage.getItem("auth-token");
  };

  static setAuthToken = (tokenInfo) => {
    localStorage.setItem("auth-token", tokenInfo);
  };

  static clearAuthToken = () => {
    localStorage.removeItem("auth-token");
  };

  static getUserID = () => {
    return localStorage.getItem("userID");
  };

  static setUserID = (userID) => {
    localStorage.setItem("userID", userID);
  };

  static clearUserID = () => {
    localStorage.removeItem("userID");
  };
}
