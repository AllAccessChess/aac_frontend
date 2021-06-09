export default class StorageService {
  static getAuthToken = () => {
    return JSON.parse(localStorage.getItem("auth-token"));
  };

  static setAuthToken = (tokenInfo) => {
    localStorage.setItem("auth-token", JSON.stringify(tokenInfo));
  };

  static getUserID = () => {
    return localStorage.getItem("userID");
  };

  static setUserID = (userID) => {
    localStorage.setItem("userID", userID);
  };

  static clearTokens = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("userID");
  };
}
