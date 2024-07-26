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

  getUpcomingGames() {
    return this.database.getAllUpcomingGames(5);
  }

  getRecentGames() {
    return this.database.getAllRecentGames(5);
  }
}
