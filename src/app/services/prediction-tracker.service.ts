import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Prediction } from '../prediction/prediction';

const NUMBER_OF_GAMES: number = 5;
const POST_ENDPOINT: string = "https://script.google.com/macros/s/AKfycbz-InjLxtyvK6cJoN2aSs2Le54ZJuKPLMDTCYlnEhsJSoUQ7nKdMyFRqUwLcBrUS4qV/exec";

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

  checkIfPlayerExists(playerName: string): boolean {
    console.log(this.database.getPlayers());
    for (let player of this.database.getPlayers()) {
      if (player.name === playerName) {
        return true;
      }
    }
    return false;
  }

  setPlayerName(playerName: string): string | null {
    if (playerName === null || playerName === "") {
      return "Please enter a valid name.";
    }

    for (let prediction of Object.values(this.predictions)) {
      prediction.playerName = playerName;
    }

    return null;
  }

  sendPredictions() {
    console.log(this.predictions);
    return;
    fetch(POST_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain', // prevents preflight request not ideal but works
      },
      body: JSON.stringify(this.predictions)
    }).then(response => {
      console.log(response);
      if (response.ok) {
        alert('Predictions saved successfully');
        window.location.href = '/'; // Redirect to the home page
      } else {
        alert('Error saving predictions');
      }
    })
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
