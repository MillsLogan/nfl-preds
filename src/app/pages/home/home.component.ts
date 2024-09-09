import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent} from '../../components/navbar/navbar.component';
import { GamesListComponent } from '../../components/games-list/games-list.component';
import { LeaderboardComponent } from '../../components/leaderboard/leaderboard.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, CommonModule, GamesListComponent,
    LeaderboardComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less'
})

export class HomeComponent {
  constructor(public database: DatabaseService) {}

  getPlayers() {
    let players = this.database.getPlayers();
    for (let game of this.database.getGames()) {
      if (game.winner === "" || game.winner === undefined) {
        continue;
      }
      for (let prediction of this.database.getPredictionsForGame(game.id)) {
        if (prediction.winner === "" || prediction.winner === undefined) {
          continue;
        }
        let player = players.find(player => player.name === prediction.playerName);
        if (player === undefined) {
          continue;
        }
        if (prediction.winner === game.winner) {
          player.correct += 1;
        }else {
          player.incorrect += 1;
        }
      }
    }
    return players
  }

  getUpcomingGames() {
    return this.database.getAllUpcomingGames(5);
  }

  getRecentGames() {
    return this.database.getAllRecentGames(5);
  }
}
