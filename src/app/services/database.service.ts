import { Injectable, Output } from '@angular/core';
import { Game } from '../game/game';
import { Team } from '../team/team';
import { Prediction } from '../prediction/prediction';
import moment from 'moment';
import { Player } from '../player/player';
import test_data from "../../data/testResponse.json";
import team_data from "../../data/teams.json";
import { TeamInformation } from '../interfaces';

// const PREDICTION_START_INDEX: number = 6;
// const HEADER_ROW_COUNT: number = 1;
const MILLS_GET_ENDPOINT: string = "https://script.google.com/macros/s/AKfycbz85w2l9mMqaOFc8XF1yaN3anb69Usk5B79hY9SPQYSgsi01tRpn3XzGStnGmFgVj7O/exec?table=games&table=players&table=predictions";
const PAM_GET_ENDPOINT: string = "https://script.google.com/macros/s/AKfycbwVWBnoxIVuxsVKh6EziCBV5xc512lKH23VtK_mtxgj-zm4cPixuCtlBoR00y5QQuBQjw/exec?table=games&table=players&table=predictions";
const WEEK_DATES: moment.Moment[] = [
  moment("2025-09-04"),
  moment("2025-09-11"),
  moment("2025-09-18"),
  moment("2025-09-25"),
  moment("2025-10-02"),
]

@Injectable({
  providedIn: 'root'
})

export class DatabaseService {
  private games: Game[] = [];
  private predictions: {[gameId: number]: {[playername: string]: Prediction}} = {};
  private players: { [name: string]: Player} = {};
  private teams: TeamInformation[] = [];
  public currentWeek: number = 1;
  @Output() ready: boolean = false;

  constructor() {
    this.init();
    const today = moment().startOf("day");
    for (const weekStartDate of WEEK_DATES) {
      if (today.isBefore(weekStartDate)) {
        break;
      }
      this.currentWeek++;
    }
  }

  /**
    * Returns the city and team name of a team given the name of the team
    * @param teamName the name of the team
    * @returns the full team name
    * @returns undefined if the team name is not found
    * @example getFullTeamName("buccaneers") => "Tampa Bay Buccaneers"
  */
  getFullTeamName(teamName: string): string | undefined {
    teamName = teamName.toLowerCase();
    for(let game of Object.values(this.games)){
      if(this.normalizeTeamName(game.home) === teamName){
        return game.home;
      }else if(this.normalizeTeamName(game.away) === teamName){
        return game.away;
      }
    }

    return undefined;
  }

  public getPamsTeams(): TeamInformation[] {
    let pamsTeams: String[] = ["steelers", "cowboys", "eagles", "vikings", "colts"]
    let teams: TeamInformation[] = [];
    for (let team of this.teams) {
      if (pamsTeams.includes(team.name.toLowerCase())) {
        teams.push(team);
      }
    }
    return teams;
  }

  public getMillsTeams(): TeamInformation[] {
    let millsTeams: String[] = ["steelers", "cowboys", "chargers", "patriots", "giants", "eagles"];
    let teams: TeamInformation[] = [];
    for (let team of this.teams) {
      if (millsTeams.includes(team.name.toLowerCase())) {
        teams.push(team);
      }
    }
    return teams;
  }

  public getTeamInformation(teamName: string): TeamInformation {
    let normName = this.normalizeTeamName(teamName);
    for (let team of this.teams) {
      if (normName === team.name.toLowerCase()) {
        return team;
      }
    }
    return this.teams[0];
  }

  /**
   * Returns the schedule of a team given the name of the team
   * a team's schedule is a list of games that the team is playing in
   * @param teamName 
   * @returns a list of games that the team is playing in
   * @example getTeamSchedule("Tampa Bay Buccaneers") => [Game, Game, Game]
   */
  getTeamSchedule(teamName: string): Game[] {
    return Object.values(this.games).filter(game => game.home === teamName || game.away === teamName).sort((a, b) => a.date.diff(b.date));
  }

  /**
   * Helper function that splits full team names into city and team name
   * @param teamName 
   * @returns returns the team name
   * @example normalizeTeamName("Tampa Bay Buccaneers") => "buccaneers"
   */
  private normalizeTeamName(teamName: string): string {
    let splitArray = teamName.toLowerCase().split(" ");
    return splitArray[splitArray.length - 1];
  }

  public getWeek(): number {
    return this.currentWeek;
  }

  public getWeekGames(week: number): Game[] {
    return Object.values(this.games).filter(game => game.week === week);
  }

  /**
   * Returns all predictions for a game
   * @param gameId 
   * @returns the predictions for a game, an array of @see Prediction
   * @example getPrediction(1) => [Prediction, Prediction, Prediction]
   */
  getPredictionsForGame(gameId: number): Prediction[] {
    if (this.predictions[gameId] === undefined) {
      return [];
    }
    return Object.values(this.predictions[gameId]);
  }

  /**
   * Returns the list of players as @see Player objects
   * @returns an array of @see Player
   */
  getPlayers(): Player[] {
    return Object.values(this.players).filter(player => player.name !== "New Player");
  }

  getGames(): Game[] {
    return Object.values(this.games);
  }

  getPredictions(): {[playername: string]: Prediction}[]{
    return Object.values(this.predictions);
  }

  private async init() {
    // const response = test_data; // STUBBED FOR TESTING
    if (window.location.href.includes("sandstrom")) {
      const response = await fetch(PAM_GET_ENDPOINT).then(response => response.json());
      this.initDB(response);
    } else {
      const response = await fetch(MILLS_GET_ENDPOINT).then(response => response.json());
      this.initDB(response);
    }
    this.ready = true;
  }

  private initDB(data: any){
    this.initGames(data.games);
    this.initPredictions(data.predictions);
    this.initPlayers(data.players);
    this.initTeams();
  }

  private initTeams() {
    this.teams = team_data.teams;
  }

  private initGames(data: any) {
    this.games = data.map((game: any) => new Game(game.gameId, game.week, moment(game.date), game.away, game.home, game.winner, game.isInternational, game.location));
  }

  private initPredictions(data: { [gameId: string]: {gameID: number, playerName: string, predictedWinner: string}[] }) {
    for (const [gameId, predictionData] of Object.entries(data)) {
      const numGameId = parseInt(gameId);
      this.predictions[numGameId] = {};
      for (const prediction of Object.values(predictionData)) {
        this.predictions[parseInt(gameId)][prediction.playerName] = new Prediction(prediction.playerName, numGameId, prediction.predictedWinner);
      }
    }
  }

  private initPlayers(data: any) {
    for (const player of data) {
      this.players[player.name] = new Player(player.name, player.color);
    }

    console.log(this.predictions);
    for (const [gameId, predictionData] of Object.entries(this.predictions)) {
      for (const [playerName, predictionInfo] of Object.entries(predictionData)) {
        const gameIdNum = parseInt(gameId);
        if (this.games[gameIdNum].winner !== "" && this.games[gameIdNum].winner !== null && this.games[gameIdNum].winner !== undefined) {
          if (this.games[gameIdNum].winner === predictionInfo.winner) {
             this.players[playerName].correct++;
          } else if(this.games[gameIdNum].winner === this.games[gameIdNum].home || this.games[gameIdNum].winner === this.games[gameIdNum].away) {
            this.players[playerName].incorrect++;
          }
        }
      }
    }
  }
}
