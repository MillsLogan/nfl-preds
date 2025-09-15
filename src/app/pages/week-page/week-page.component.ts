import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { Game } from '../../game/game';
import { GamesListComponent } from '../../components/games-list/games-list.component';
import { LeaderboardComponent } from '../../components/leaderboard/leaderboard.component';
import { Player } from '../../player/player';

@Component({
  selector: 'app-week-page',
  standalone: true,
  imports: [CommonModule, GamesListComponent, LeaderboardComponent],
  templateUrl: './week-page.component.html',
  styleUrl: './week-page.component.less'
})
export class WeekPageComponent {
  public weekNumber: number = 0;
  public weekGames: Game[] = [];
  public static readonly WEEKS: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  public playerPredictions: {[playerName: string]: {correct: number, incorrect: number}} = {};

  constructor(private route: ActivatedRoute, 
      private database: DatabaseService) {
        let selectedWeek = this.route.snapshot.paramMap.get('week');
        if (selectedWeek !== null){
          this.weekNumber = parseInt(selectedWeek);
          if (isNaN(this.weekNumber)){
            this.weekNumber = this.database.currentWeek;
          }
        }else{
          this.weekNumber = this.database.currentWeek;
        }
        
        this.weekGames = this.database.getWeekGames(this.weekNumber);
        this.initRecords();
    }

    public getWeekNumbers(): number[] {
      return WeekPageComponent.WEEKS;
    }

    public changeWeek(week: number) {
      this.weekNumber = week;
      this.weekGames = this.database.getWeekGames(this.weekNumber);
      this.initRecords();
    }

    public getPlayerScores(): any[] {
      let players = this.sortPlayers();
      let playerScores: Player[] = [];
      players.forEach(player => {
        playerScores.push(new Player(
          player,
          "000000",
          this.playerPredictions[player].correct,
          this.playerPredictions[player].incorrect
        ));
      });
      return playerScores;
    }

    public initRecords() {
      this.database.getPlayers().forEach(player => {
        this.playerPredictions[player.name] = {correct: 0, incorrect: 0};
      });

      this.weekGames.forEach(game => {
        this.database.getPredictionsForGame(game.id).forEach(prediction => {        
          if(this.playerPredictions[prediction.playerName] === undefined || prediction.winner === ""){
            return;
          }

          if(prediction.winner === game.winner){
            this.playerPredictions[prediction.playerName].correct += 1;
          }else if(game.winner !== "" && game.winner !== undefined && game.winner !== null){
            this.playerPredictions[prediction.playerName].incorrect += 1;
          }
        });
      });
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
        }
      });
      return players;
    }
}
