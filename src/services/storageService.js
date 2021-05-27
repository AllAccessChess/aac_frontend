export default class StorageService {
  getAuthToken = () => {
    return JSON.parse(localStorage.getItem("auth-token"));
  };

  setAuthToken = (tokenInfo) => {
    localStorage.setItem("auth-token", JSON.stringify(tokenInfo));
  };

  clearAuthToken = () => {
    localStorage.removeItem("auth-token");
  };
}
