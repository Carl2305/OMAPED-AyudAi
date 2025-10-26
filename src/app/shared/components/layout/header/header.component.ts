import { Component, OnInit } from '@angular/core';
import { JwtPayload } from '@core/models/auth/auth.interface';
import { UsuarioInfoResponse } from '@core/models/auth/user.interface';
import { AuthService } from '@core/services/auth/auth.service';
import { SecureStorageService } from '@shared/utils/services/storage/secure-storage.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  userInitials: string = '';
  nameUser: string = '';
  accessHour: string ='';
  constructor(private secureStorageService: SecureStorageService, private authService: AuthService) {
  }

  ngOnInit(): void {
    const token = this.secureStorageService.getItem('access_token');
    if (token) {
      const decodedToken: JwtPayload = this.authService.getTokenClaims()!;
      if (decodedToken) {
        const dateTime = decodedToken.auth_time!.split(' ');
        this.accessHour = `${dateTime[1]} ${dateTime[2]}`;
      }
      
      const currentUser = this.secureStorageService.getItem('current_user');
      if (currentUser) {
        const user: UsuarioInfoResponse = JSON.parse(currentUser);
        const nombreCompleto = user.nombre.split(' ');
        this.nameUser = `${nombreCompleto[0]} ${nombreCompleto[1]}`;
        this.userInitials = `${nombreCompleto[0].charAt(0)}${nombreCompleto[1].charAt(0)}`.toUpperCase();
      }
    }
    
  }
}
