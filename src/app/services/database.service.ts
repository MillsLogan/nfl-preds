import { Injectable, Output } from '@angular/core';
import { Game } from '../game/game';
import { Team } from '../team/team';
import { Prediction } from '../prediction/prediction';
import moment from 'moment';
import { Player } from '../player/player';
import test_data from "../../data/testResponse.json";
import team_data from "../../data/teams.json";

const PREDICTION_START_INDEX: number = 6;
const HEADER_ROW_COUNT: number = 1;
const GET_ENDPOINT: string = "https://script.google.com/macros/s/AKfycbxr0dPGU8x52-XtFuZ_B7H1FNcy8O7HmmezxOtZ7J8uujpHZSSMsMCBj02emTACB0pF/exec";
const WEEK_DATES: moment.Moment[] = [
  moment("2024-09-05"),
  moment("2024-09-12"),
  moment("2025-09-19")
]

interface TeamInformation {
  name: string;
  city: string;
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  abbreviation: string;
}

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
    const response = test_data; // STUBBED FOR TESTING await fetch(GET_ENDPOINT).then(response => response.json());
    this.initDB(response);
    
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
    this.games = data.map((game: any) => new Game(game.gameId, game.week, moment(game.date), game.away, game.home, game.winner));
    console.log(this.games);
  }

  private initPredictions(data: { [gameId: string]: {[playerName: string]: string}}) {
    for (const [gameId, predictionData] of Object.entries(data)) {
      const numGameId = parseInt(gameId);
      this.predictions[numGameId] = {};
      for (const [playerName, prediction] of Object.entries(predictionData)) {
        this.predictions[parseInt(gameId)][playerName] = new Prediction(playerName, numGameId, prediction);
      }
    }
  }

  private initPlayers(data: any) {
    for (const player of data) {
      this.players[player.name] = new Player(player.name, player.color);
    }


    for (const [gameId, predictionData] of Object.entries(this.predictions)) {
      for (const [playerName, prediction] of Object.entries(predictionData)) {
        const gameIdNum = parseInt(gameId);
        if (this.games[gameIdNum].winner === prediction.winner) {
          this.players[playerName].correct++;
        } else if(this.games[gameIdNum].winner === this.games[gameIdNum].home || this.games[gameIdNum].winner === this.games[gameIdNum].away) {
          this.players[playerName].incorrect++;
        }
      }
    }
  }
}
