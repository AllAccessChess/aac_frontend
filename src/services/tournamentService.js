import BaseAPIService from "./baseAPIService";

export default class TournamentService extends BaseAPIService {
  static getAllTournaments = () => {
    return this.request("/tournaments/all", "GET");
  };
  static getTournament = (tournamentID) => {
    return this.requestWithAuth(`/tournaments/get/${tournamentID}`, "GET");
  };
}
