import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  userInitials: string = 'RA';
  nameUser: string = 'Roberto Andrade';
  accessHour: string = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  constructor() {
  }
}
