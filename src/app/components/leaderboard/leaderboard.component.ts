import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Player } from '../../player/player';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [NgFor, CommonModule],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.less'
})

export class LeaderboardComponent implements OnInit, OnChanges {
  @Input() players: Player[] = [];

  ngOnInit() {
    this.players.sort((a, b) => {
      if (a.correct > b.correct) {
        return -1;
      } else if (a.correct < b.correct) {
        return 1;
      } else {
        return 0;
      }
    });

    this.players = this.players.filter(player => player.name !== 'New Player');
  }

  ngOnChanges(): void {
    this.players.sort((a, b) => {
      if (a.correct > b.correct) {
        return -1;
      } else if (a.correct < b.correct) {
        return 1;
      } else {
        return 0;
      }
    });

    this.players = this.players.filter(player => player.name !== 'New Player');
  }
}
