import BaseAPIService from "./baseAPIService";

export default class TournamentService extends BaseAPIService {
  static getAllTournaments = () => {
    return this.request("/tournaments/all", "GET");
  };
  static getTournament = (tournamentID) => {
    return this.request(`/tournaments/get/${tournamentID}`, "GET");
  };
  static registerTournament = (tournamentID) => {
    return this.requestWithAuth(
      `/tournaments/register/${tournamentID}`,
      "POST"
    );
  };
  static unregisterTournament = (tournamentID) => {
    return this.requestWithAuth(
      `/tournaments/unregister/${tournamentID}`,
      "POST"
    );
  };
  static getPairings = (tournamentID, roundID) => {
    return this.requestWithAuth(
      `/tournaments/pairings/get/${tournamentID}/${roundID}`,
      "GET"
    );
  };
  static updatePairings = (tournamentID, roundID, pairings) => {
    return this.requestWithAuth(
      `/tournaments/pairings/update/${tournamentID}/${roundID}`,
      "POST",
      {
        unpaired: [],
        pairings,
      }
    );
  };
}
