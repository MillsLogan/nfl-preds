import { Injectable, Output } from '@angular/core';
import { Game } from '../game/game';
import { Team } from '../team/team';
import { Prediction } from '../prediction/prediction';
import moment from 'moment';
import { Player } from '../player/player';
declare var gapi: any;

const APIKEY: string = "AIzaSyBdRF5JfDAWvs-nwT1UESo5nnZPS0L6aaY";
const SHEETID: string = "10QAbJKl5CWf0XjEPYWHMmhDDO8b2LCp-441bOKMTuFQ";
const RANGE: string = "AllGames!A1:N92";
const PREDICTION_START_INDEX: number = 6;
const HEADER_ROW_COUNT: number = 1;

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

  getTeamSchedule(teamName: string): Game[] {
    return Object.values(this.games).filter(game => game.home === teamName || game.away === teamName).sort((a, b) => a.date.diff(b.date));
  }

  private normalizeTeamName(teamName: string): string {
    let splitArray = teamName.toLowerCase().split(" ");
    return splitArray[splitArray.length - 1];
  }

  getAllUpcomingGames(limit: number): Game[] {
    let upcomingGames: Game[] = Object.values(this.games);
    upcomingGames = upcomingGames.filter(game => game.date.isAfter(moment()));
    upcomingGames.sort((a, b) => a.date.diff(b.date));
    return upcomingGames.slice(0, limit);
  }

  getAllRecentGames(limit: number): Game[] {
    let recentGames: Game[] = Object.values(this.games);
    recentGames = recentGames.filter(game => game.date.isBefore(moment()));
    recentGames.sort((a, b) => b.date.diff(a.date));
    return recentGames.slice(0, limit);
  }

  getPredictionsForGame(gameId: number): Prediction[] {
    return Object.values(this.predictions[gameId]);
  }

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

  /*
  * Extremely scuffed way to update the ready but the only way I could get it to work
  */
  private async init() {
    await gapi.load('client', () => this.fetchSheetData(SHEETID, RANGE).then(data => {this.initDB(data); this.ready = true;}));
    let interval = setInterval(() => {
      console.log(this.ready);
    }, 1000);
    while(!this.ready){
      await new Promise(r => setTimeout(r, 1000));
    }
    clearInterval(interval);
  }

  private initDB(data: any){
    this.initPlayers(data[0].slice(PREDICTION_START_INDEX));
    this.initGamesAndPredictions(data.slice(HEADER_ROW_COUNT));
  }

  private initGamesAndPredictions(data: any) {
    data.map((row: any, gameId: number) => {
      let game = Game.fromSheetRow(gameId, row);
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

  private fetchSheetData(sheetID: string, range: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      await gapi.client.init({
        'apiKey': APIKEY,
      });

      let response = await gapi.client.request({
        'path': `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${range}`,
      });

      resolve(response.result.values);
    })
  }
}
