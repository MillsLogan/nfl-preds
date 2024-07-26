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
  }

  ngOnInit() {
    this.initRecords();
  }

  ngOnChanges() {
    this.initRecords();
  }

  private initRecords() {
    this.database.getPlayers().forEach(player => {
      this.playerPredictions[player.name] = {wins: 0, losses: 0, correct: 0, incorrect: 0};
    });

    this.teamSchedule.forEach(game => {
      this.database.getPredictionsForGame(game.id).forEach(prediction => {        
        if(this.playerPredictions[prediction.playerName] === undefined){
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
}
