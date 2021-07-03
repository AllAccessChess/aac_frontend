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
  static startRound = (tournamentID) => {
    return this.requestWithAuth(
      `/tournaments/startround/${tournamentID}`,
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
      pairings
    );
  };
  static getByes = (tournamentID) => {
    return this.requestWithAuth(`/tournaments/byes/get/${tournamentID}`, "GET");
  };
  static updateByes = (tournamentID, byes) => {
    return this.requestWithAuth(
      `/tournaments/byes/update/${tournamentID}`,
      "POST",
      {
        byes,
      }
    );
  };
}
