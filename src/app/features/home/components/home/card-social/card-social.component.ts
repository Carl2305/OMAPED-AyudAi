import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface SocialLink {
  name: string;
  icon: string;
  url: string;
  class: string;
  color?: string;
}

@Component({
  selector: 'app-card-social',
  standalone: true,
  imports: [NgFor],
  templateUrl: './card-social.component.html',
  styleUrl: './card-social.component.scss'
})
export class CardSocialComponent implements OnInit {
  socialLinks = [
    { name: 'Facebook', icon: 'fab fa-facebook-f', url: 'https://www.facebook.com', class: 'social-facebook' },
    { name: 'Instagram', icon: 'fab fa-instagram', url: 'https://www.instagram.com', class: 'social-instagram' },
    { name: 'LinkedIn', icon: 'fab fa-linkedin-in', url: 'https://www.linkedin.com', class: 'social-linkedin' },
    { name: 'YouTube', icon: 'fab fa-youtube', url: 'https://www.youtube.com', class: 'social-youtube' },
    { name: 'TikTok', icon: 'fa-brands fa-tiktok', url: 'https://www.tiktok.com', class: 'social-tiktok' }
  ];

  constructor() {

  }

  ngOnInit(): void {
    this.loadSocialLinks();
  }

  private loadSocialLinks(): void {
    // Ejemplo de cómo podrías cargar los links desde un servicio
    // this.socialService.getSocialLinks().subscribe(links => {
    //   this.socialLinks = links;
    // });
  }

  onSocialClick(link: SocialLink): void {
    // Opcional: agregar tracking de analytics
    console.log(`Clicked on ${link.name}`);
    // Ejemplo: this.analytics.track('social_click', { platform: link.name });
  }
}
