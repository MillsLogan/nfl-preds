import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.less'
})

export class NavbarComponent {
  @Input() public activePage: string = 'home';
}