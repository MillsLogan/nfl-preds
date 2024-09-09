import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../game/game';
import { DatabaseService } from '../../services/database.service';


@Component({
  selector: 'app-team-leaderboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-leaderboard.component.html',
  styleUrl: './team-leaderboard.component.less'
})
export class TeamLeaderboardComponent implements OnInit, OnChanges {
  @Input() public teamName!: string;
  @Input() public teamSchedule: Game[] = [];

  public playerPredictions: {[playerName: string]: {wins: number, losses: number, correct: number, incorrect: number}} = {};

  constructor(private database: DatabaseService) {
    this.initRecords();
    this.sortPlayers();
  }

  ngOnInit() {
    this.initRecords();
    this.sortPlayers();
  }

  ngOnChanges() {
    this.initRecords();
    this.sortPlayers();
  }

  private initRecords() {
    this.database.getPlayers().forEach(player => {
      this.playerPredictions[player.name] = {wins: 0, losses: 0, correct: 0, incorrect: 0};
    });

    this.teamSchedule.forEach(game => {
      this.database.getPredictionsForGame(game.id).forEach(prediction => {        
        if(this.playerPredictions[prediction.playerName] === undefined || prediction.winner === ""){
          return;
        }

        if(prediction.winner === this.teamName){
          this.playerPredictions[prediction.playerName].wins += 1;
        }else{
          this.playerPredictions[prediction.playerName].losses += 1;
        }

        if(prediction.winner === game.winner){
          this.playerPredictions[prediction.playerName].correct += 1;
        }else if(game.winner !== ""){
          this.playerPredictions[prediction.playerName].incorrect += 1;
        }
      });
    });
  }

  public getPlayers(){
    return Object.keys(this.playerPredictions);
  }

  private sortPlayers(){
    let players = Object.keys(this.playerPredictions);
    players.sort((a, b) => {
      let playerA = this.playerPredictions[a];
      let playerB = this.playerPredictions[b];
      if(playerA.correct > playerB.correct){
        return -1;
      }else if(playerA.correct < playerB.correct){
        return 1;
      }else{
        return 0;
      }});
      let newPlayerRecord: {[playerName: string]: {wins: number, losses: number, correct: number, incorrect: number}} = {};
      for (let i = 0; i < players.length; i++) {
        let player = players[i];
        let playerRecord = this.playerPredictions[player];
        newPlayerRecord[player] = playerRecord;
      }
      this.playerPredictions = newPlayerRecord;
  }
}
