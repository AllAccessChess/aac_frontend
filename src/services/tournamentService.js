import BaseAPIService from "./baseAPIService";

export default class TournamentService extends BaseAPIService {
  static getAllTournaments = () => {
    return this.requestWithAuth("/tournaments/all", "GET");
  };
  static getTournament = (tournamentID) => {
    return this.requestWithAuth(`/tournaments/get/${tournamentID}`, "GET");
  };
  static createTournament = (payload) => {
    return this.requestWithAuth(`/tournaments/create`, "POST", payload);
  };
  static updateTournament = (payload) => {
    return this.requestWithAuth(`/tournaments/update`, "POST", payload);
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
  static publishTournament = (tournamentID) => {
    return this.requestWithAuth(`/tournaments/publish/${tournamentID}`, "POST");
  };
  static unpublishTournament = (tournamentID) => {
    return this.requestWithAuth(
      `/tournaments/unpublish/${tournamentID}`,
      "POST"
    );
  };
  static startRound = (tournamentID, bracketID = -1) => {
    return this.requestWithAuth(
      `/tournaments/startround/${tournamentID}/${bracketID}`,
      "POST"
    );
  };
  static getPairings = (tournamentID, bracketID, roundID) => {
    return this.requestWithAuth(
      `/tournaments/pairings/get/${tournamentID}/${bracketID}/${roundID}`,
      "GET"
    );
  };
  static updatePairings = (tournamentID, bracketID, roundID, pairings) => {
    return this.requestWithAuth(
      `/tournaments/pairings/update/${tournamentID}/${bracketID}/${roundID}`,
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
