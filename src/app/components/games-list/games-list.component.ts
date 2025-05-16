import { Component, Input } from '@angular/core';
import { Game } from '../../game/game';
import { NgFor } from '@angular/common';
import { GameComponent } from '../../game/game.component';
import { CommonModule } from '@angular/common';
import { Prediction } from '../../prediction/prediction';
import { DatabaseService } from '../../services/database.service';
import { Player } from '../../player/player';
import moment, { Moment } from 'moment';

@Component({
  selector: 'app-games-list',
  standalone: true,
  imports: [GameComponent, NgFor, CommonModule],
  templateUrl: './games-list.component.html',
  styleUrl: './games-list.component.less'
})
export class GamesListComponent {
  @Input() public games: Game[] = [];
  @Input() public addByeWeek: boolean = false;
  public players: Player[] = this.database.getPlayers();
  
  constructor(private database: DatabaseService) {
  }


  getPredictionsForGame(gameId: number): Prediction[] {
    return this.database.getPredictionsForGame(gameId);
  }
}
