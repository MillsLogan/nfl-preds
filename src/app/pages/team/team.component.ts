import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { Game } from '../../game/game';
import { GamesListComponent } from '../../components/games-list/games-list.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { TeamLeaderboardComponent } from '../../components/team-leaderboard/team-leaderboard.component';
import { initZone } from 'zone.js/lib/zone-impl';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [NavbarComponent, GamesListComponent, TeamLeaderboardComponent],
  templateUrl: './team.component.html',
  styleUrl: './team.component.less'
})

export class TeamComponent {
  public teamName!: string;
  public teamSchedule!: Game[];
  public wins: number = 0;
  public losses: number = 0;

  constructor(private route: ActivatedRoute, 
    private database: DatabaseService,
    private router: Router) {
      this.init();
      this.router.events.subscribe(() => {
        if(this.route.snapshot.paramMap.get('teamName') !== this.teamName){
          this.init();
        }
      });
    }

    private init(){
      this.wins = 0;
      this.losses = 0;
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

      this.teamSchedule = this.database.getTeamSchedule(this.teamName).sort((a,b) => a.week - b.week);
      this.initRecord();
    }

  

  getAllGames() {
    return this.teamSchedule;
  }

  private initRecord() {
    this.teamSchedule.forEach(game => {
      if (game.winner === this.teamName) {
        this.wins++;
      } else if(game.winner !== ""){
        this.losses++;
      }
    });
  }

  changeTeamName(teamName: string) {
    this.teamName = teamName;
    this.teamSchedule = this.database.getTeamSchedule(teamName);
  }
}
