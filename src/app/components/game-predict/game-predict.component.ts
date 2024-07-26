import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Game } from '../../game/game';

@Component({
  selector: 'app-game-predict',
  standalone: true,
  imports: [],
  templateUrl: './game-predict.component.html',
  styleUrl: './game-predict.component.less'
})


export class GamePredictComponent {
  @Input() public game!: Game;
  @Input() public currentTeam!: string;
  @Input() public prediction: string = '';
  @Output() public gamePredicted: EventEmitter<Object> = new EventEmitter<Object>();

  constructor() {

  }

  setPrediction(prediction: string) {
    this.prediction = prediction;
    this.gamePredicted.emit({game: this.game, prediction: prediction});
  }
}
