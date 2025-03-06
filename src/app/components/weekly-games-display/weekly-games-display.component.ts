import { Component, Input } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Game } from '../../game/game';

@Component({
  selector: 'app-weekly-games-display',
  standalone: true,
  imports: [],
  templateUrl: './weekly-games-display.component.html',
  styleUrl: './weekly-games-display.component.less'
})
export class WeeklyGamesDisplayComponent {
  @Input() public games: Game[] = [];
  
  constructor(private database: DatabaseService) {

  }

  

}
