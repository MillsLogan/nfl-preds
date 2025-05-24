import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Prediction } from '../prediction/prediction';
import { Router } from '@angular/router';

const MILLS_POST_ENDPOINT: string = "https://script.google.com/macros/s/AKfycbz85w2l9mMqaOFc8XF1yaN3anb69Usk5B79hY9SPQYSgsi01tRpn3XzGStnGmFgVj7O/exec";
const PAM_POST_ENDPOINT: string = "https://script.google.com/macros/s/AKfycbwVWBnoxIVuxsVKh6EziCBV5xc512lKH23VtK_mtxgj-zm4cPixuCtlBoR00y5QQuBQjw/exec";
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
    const NUMBER_OF_GAMES = this.database.getGames().length;
    if (Object.keys(this.predictions).length !== NUMBER_OF_GAMES) {
      return false;
    }
    return true;
  }

  checkIfPlayerExists(playerName: string): boolean {
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

  sendPredictions(color?: string | null) {
    const POST_ENDPOINT = location.href.includes("mills") ? MILLS_POST_ENDPOINT : PAM_POST_ENDPOINT;
    
    let postBody: {[key: string]: object | null} = {
      "newPlayer": null,
      "predictions": this.predictions
    };

    if (!this.checkIfPlayerExists(this.predictions[0].playerName)){
      postBody["newPlayer"] = {
        playerName: this.predictions[0].playerName,
        color: color ?? "red"
      }
    }

    console.log(postBody);

    fetch(POST_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain', // prevents preflight request not ideal but works
      },
      body: JSON.stringify(postBody)
    }).then(response => {
      console.log(response);
      if (response.ok) {
        alert('Predictions saved successfully');
        setTimeout(() => {
          window.location.href = window.location.href.includes("mills") ? "/mills" : "sandstrom"; // Redirect to the home page
        }, 1000);
      } else {
        alert('Error saving predictions');
      }
    })
  }

  isTeamComplete(teamName: string): boolean {
    let teamSchedule = this.database.getTeamSchedule(teamName);
    console.log("Team schedule: ", teamName);
    for (let game of teamSchedule) {
      if (!this.predictions[game.id]) {
        return false;
      }
    }
    return true;
  }
}
