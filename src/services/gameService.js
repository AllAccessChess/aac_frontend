import BaseAPIService from "./baseAPIService";

export default class GameService extends BaseAPIService {
  static getLiveGames = () => {
    return this.request("/games/live", "GET");
  };
  static getGame = (gameID) => {
    return this.requestWithAuth(`/games/get/${gameID}`, "GET");
  };
  static getPGNData = (gameID) => {
    return this.request(`/games/pgn/${gameID}`, "GET");
  };
}
