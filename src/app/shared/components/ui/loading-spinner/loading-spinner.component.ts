import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LoadingSpinnerService } from '@shared/utils/services/loading-spinner/loading-spinner.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss'
})
export class LoadingSpinnerComponent {
  @Input() isGlobal: boolean = false;
  @Input() message: string = '';
  @Input() show: boolean | null = null; // Para uso independiente

  isLoading: boolean = false;
  private subscription?: Subscription;

  constructor(private loadingSpinnerService: LoadingSpinnerService) {}

  ngOnInit() {
    // Si show está definido, usar ese valor (uso independiente)
    if (this.show !== null) {
      this.isLoading = this.show;
      return;
    }

    // Si es global, suscribirse al servicio global
    if (this.isGlobal) {
      this.subscription = this.loadingSpinnerService.loading$.subscribe(
        loading => this.isLoading = loading
      );
    } else {
      // Para uso local, también puede suscribirse al servicio si es necesario
      this.subscription = this.loadingSpinnerService.loading$.subscribe(
        loading => this.isLoading = loading
      );
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
