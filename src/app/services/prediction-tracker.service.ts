import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Prediction } from '../prediction/prediction';

const NUMBER_OF_GAMES: number = 91;

@Injectable({
  providedIn: 'root'
})
export class PredictionTrackerService {
  private predictions: {[gameId: number]: Prediction} = {};

  constructor(private database: DatabaseService) {
  }

  addPrediction(gameId: number, prediction: string) {
    this.predictions[gameId] = new Prediction("new player", gameId, prediction);
  }

  getPredictionForGame(gameId: number): string {
    let prediction = this.predictions[gameId];
    if (prediction) {
      return prediction.winner;
    }
    return "";
  }

  getRecord(teamName: string): [number, number] {
    let wins = 0;
    let losses = 0;
    let teamSchedule = this.database.getTeamSchedule(teamName);
    for (let game of teamSchedule) {
      let prediction = this.predictions[game.id];
      if (prediction) {
        if (prediction.winner === teamName) {
          wins++;
        } else {
          losses++;
        }
      }
    }
    return [wins, losses];
  }

  validatePredictions(): boolean {
    if (Object.keys(this.predictions).length !== NUMBER_OF_GAMES) {
      return false;
    }
    return true;
  }

  savePredictions() {
    let outputString = "home,away,prediction\n"
    let games = this.database.getGames();
    Object.values(games).forEach(game => {
      // Download the predictions as a CSV file
      outputString += `${game.home},${game.away},${this.predictions[game.id].winner}\n`;
    });
    let blob = new Blob([outputString], {type: 'text/csv'});
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.download = 'predictions.csv';
    a.href = url;
    a.click();
  }
}
