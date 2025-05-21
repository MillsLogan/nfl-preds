import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DatabaseService } from './services/database.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoadingComponent } from './components/loading/loading.component';
import { FooterComponent } from './components/footer/footer.component';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingComponent, CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'ngfootball';
  millsTeams: string[] = ["steelers", "cowboys", "chargers", "patriots", "giants", "eagles"];
  pamsTeams: string[] = ["steelers", "cowboys", "eagles", "vikings", "colts"];

  constructor(public database: DatabaseService, public router: Router) {
  }

  public getHousehold(): string {
    let url = this.router.url.split('/')[1];
    console.log(url);
    if (url === "mills" || url === "sandstrom") {
      return url;
    }
    return "mills";
  }

  public getActivePage(): string {
    let url_parts = this.router.url.split('/');
    if (url_parts.length < 3) {
      return "home";
    }
    let currentPage = this.router.url.split('/')[2];
    switch (currentPage) {
      case "home":
        return "home";
      case "team":
        return "team";
      case "predict":
        return "predict";
      case "week":
        return "week";
      default:
        return "home";
    }
  }
}
