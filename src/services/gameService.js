import BaseAPIService from "./baseAPIService";

export default class GameService extends BaseAPIService {
  static getLiveGames = () => {
    return this.request("/games/live", "GET");
  };
  static getGame = (gameID) => {
    return this.requestWithAuth(`/games/get/${gameID}`, "GET");
  };
  static adjustGame = (payload) => {
    return this.requestWithAuth(`/games/adjust`, "POST", payload);
  };
  static getPGNData = (gameID) => {
    return this.request(`/games/pgn/${gameID}`, "GET");
  };
}
