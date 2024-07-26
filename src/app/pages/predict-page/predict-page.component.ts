import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { GamePredictComponent } from '../../components/game-predict/game-predict.component';
import { PredictionTrackerService } from '../../services/prediction-tracker.service';
import { Game } from '../../game/game';
import { GamesListComponent } from '../../components/games-list/games-list.component';

@Component({
  selector: 'app-predict-page',
  standalone: true,
  imports: [NavbarComponent, GamePredictComponent, CommonModule, GamesListComponent],
  templateUrl: './predict-page.component.html',
  styleUrl: './predict-page.component.less'
})

export class PredictPageComponent {
  public teamName: string = "Steelers";
  private teamSchedule: Game[] = [];
  public wins: number = 0;
  public losses: number = 0;

  constructor(private route: ActivatedRoute, 
    private database: DatabaseService,
    private predictions: PredictionTrackerService) {
      let teamName = this.route.snapshot.paramMap.get('teamName');
      if (teamName !== null){
        let fullName = this.database.getFullTeamName(teamName);
        if (fullName !== undefined){
          this.teamName = fullName;
        }else{
          this.teamName = "Pittsburgh Steelers";
        }
      }else{
        this.teamName = "Pittsburgh Steelers";
      }
      
      this.teamSchedule = this.database.getTeamSchedule(this.teamName);
      console.log(this.teamSchedule);
    }

  getAllGames() {
    return this.teamSchedule.sort((a,b) => a.week - b.week);
  }

  getPredictionForGame(gameId: number): string {
    return this.predictions.getPredictionForGame(gameId);
  }

  updateRecord($event: any) {
      let game = $event.game;
      let prediction = $event.prediction;
      this.predictions.addPrediction(game.id, prediction);
      let record = this.predictions.getRecord(this.teamName);
      this.wins = record[0];
      this.losses = record[1];
  }

  changeTeamName(teamName: string) {
    this.teamName = teamName;
    this.teamSchedule = this.database.getTeamSchedule(teamName);
    let record = this.predictions.getRecord(this.teamName);
    this.wins = record[0];
    this.losses = record[1];
  }

  savePredictions() {
    // Validate all predictions
    if(this.predictions.validatePredictions()){
      this.predictions.savePredictions();
    }else{
      alert("One or more of your predictions is invalid. Please fix them before saving.");
    }
  }

  playVideos() {
    for(let i = 0; i < document.getElementsByClassName("video").length; i++){
      let video = document.getElementsByClassName("video")[i] as HTMLVideoElement;
      video.play();
    }
  }
}
