import { Injectable, Output } from '@angular/core';
import { Game } from '../game/game';
import { Team } from '../team/team';
import { Prediction } from '../prediction/prediction';
import moment from 'moment';
import { Player } from '../player/player';

const PREDICTION_START_INDEX: number = 6;
const HEADER_ROW_COUNT: number = 1;
const GET_ENDPOINT: string = "https://script.google.com/macros/s/AKfycbxr0dPGU8x52-XtFuZ_B7H1FNcy8O7HmmezxOtZ7J8uujpHZSSMsMCBj02emTACB0pF/exec";

@Injectable({
  providedIn: 'root'
})

export class DatabaseService {
  private games: { [id: number]: Game }= {};
  private predictions: {[gameId: number]: {[playername: string]: Prediction}} = {};
  private players: { [id: string]: Player} = {};
  private teams: Team[] = [new Team("Tampa Bay", "Buccaneers", [], 0, 0, 0), new Team("Dallas", "Cowboys", [], 0, 0, 0)];
  @Output() ready: boolean = false;

  constructor() {
    this.init();
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

  /**
   * Returns games that have not happened yet up to a certain limit
   * @param limit 
   * @returns a list of the soonest games that have not happened yet
   * @example getAllUpcomingGames(3) => [Game, Game, Game]
   */
  getAllUpcomingGames(limit: number): Game[] {
    let upcomingGames: Game[] = Object.values(this.games);
    upcomingGames = upcomingGames.filter(game => game.date.isAfter(moment()));
    upcomingGames.sort((a, b) => a.date.diff(b.date));
    return upcomingGames.slice(0, limit);
  }

  /**
   * Returns games that have already happened up to a certain limit
   * @param limit 
   * @returns a list of the most recent games that have already happened
   * @example getAllRecentGames(3) => [Game, Game, Game]
   */
  getAllRecentGames(limit: number): Game[] {
    let recentGames: Game[] = Object.values(this.games);
    recentGames = recentGames.filter(game => game.date.isBefore(moment()));
    recentGames.sort((a, b) => b.date.diff(a.date));
    return recentGames.slice(0, limit);
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

  getTeams(): Team[] {
    return this.teams;
  }

  getPredictions(): {[playername: string]: Prediction}[]{
    return Object.values(this.predictions);
  }

  private async init() {
    const raw_sheet_data = await fetch(GET_ENDPOINT).then(response => response.json());
    this.initDB(raw_sheet_data);
    this.ready = true;
  }

  private initDB(data: any){
    // Get the player names from the first row
    this.initPlayers(data[0].slice(PREDICTION_START_INDEX));
    // Remove the header row and process the rest of the data
    this.initGamesAndPredictions(data.slice(HEADER_ROW_COUNT));
  }

  private initGamesAndPredictions(data: any) {
    data.map((row: any) => {
      let game = Game.fromSheetRow(row);
      let gameId = game.id;
      this.games[gameId] = game;

      Object.keys(this.players).map((playerName, playerIndex) => {
        let prediction = new Prediction(playerName, gameId, row[PREDICTION_START_INDEX + playerIndex]);
        this.predictions[gameId] = this.predictions[gameId] || {};
        this.predictions[gameId][playerName] = prediction;
      });
    });
  }

  private initPlayers(playerNames: string[]) {
    for(let i = 0; i < playerNames.length; i++) {
      let player = new Player(playerNames[i], 0, 0);
      this.players[player.name] = player;
    }
  }
}
