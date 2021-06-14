export default class StorageService {
  static getAuthToken = () => {
    return JSON.parse(localStorage.getItem("auth-token"));
  };

  static setAuthToken = (tokenInfo) => {
    localStorage.setItem("auth-token", JSON.stringify(tokenInfo));
  };

  static clearTokens = () => {
    localStorage.removeItem("auth-token");
  };
}
