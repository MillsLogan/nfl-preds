import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DatabaseService } from './services/database.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoadingComponent } from './components/loading/loading.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingComponent, CommonModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'ngfootball';

  constructor(public database: DatabaseService) {}
}
