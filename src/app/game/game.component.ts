import { Component, Input } from '@angular/core';
import { Game } from './game';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import moment from 'moment';
import { Prediction } from '../prediction/prediction';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './game.component.html',
  styleUrl: './game.component.less'
})
export class GameComponent {
  
  @Input() game: Game = new Game(-1, -1, moment("09-09-2021", "MM-DD-YYYY"), "", "", "", null);
  @Input() predictions: Prediction[] = [];
}
