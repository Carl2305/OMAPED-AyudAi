import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { interval, Subject, takeUntil, switchMap, EMPTY, BehaviorSubject, startWith, tap } from 'rxjs';

@Component({
  selector: 'app-card-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-slider.component.html',
  styleUrl: './card-slider.component.scss'
})
export class CardSliderComponent implements OnInit, OnDestroy {
  private readonly isBrowser: boolean;
  private readonly destroy$ = new Subject<void>();
  private readonly autoSlideActive$ = new BehaviorSubject<boolean>(true);

  currentSlide = 0;
  touchStartX = 0;
  touchEndX = 0;

  // Propiedades para controlar qué slides mostrar
  showSocialSlide = true;
  showFaqSlide = true;
  showPaymentSlide = true;

  // Propiedades adicionales para personalización
  enablePaymentFeature = false; // Controla si mostrar badge "NUEVO"

  // Configuración del auto-slide
  private readonly autoSlideInterval = 4000; // ms

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  get visibleSlides(): ReadonlyArray<{type: string, index: number}> {
    const slides: Array<{type: string, index: number}> = [];
    let currentIndex = 0;

    if (this.showSocialSlide) {
      slides.push({ type: 'credit-vehicle', index: currentIndex++ });
    }
    if (this.showFaqSlide) {
      slides.push({ type: 'faq', index: currentIndex++ });
    }

    return slides;
  }

  get totalSlides(): number {
    return this.visibleSlides.length;
  }

  ngOnInit(): void {
    // this.validateSlideIndex();

    // if (this.isBrowser && this.totalSlides > 1) {
    //   this.setupAutoSlide();
    // }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.autoSlideActive$.complete();
  }

  nextSlide(): void {
    if (this.totalSlides <= 1) return;
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.restartAutoSlide();
  }

  prevSlide(): void {
    if (this.totalSlides <= 1) return;
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.restartAutoSlide();
  }

  goToSlide(index: number): void {
    if (this.isValidSlideIndex(index)) {
      this.currentSlide = index;
      this.restartAutoSlide();
    }
  }

  isActiveSlide(index: number): boolean {
    return index === this.currentSlide;
  }

  isPrevSlide(index: number): boolean {
    return index < this.currentSlide;
  }

  getSlideClass(slideIndex: number): string {
    const slideType = this.visibleSlides[slideIndex]?.type;
    const baseClass = `slide slide-${slideType}`;

    if (this.isActiveSlide(slideIndex)) {
      return `${baseClass} active`;
    }
    if (this.isPrevSlide(slideIndex)) {
      return `${baseClass} prev`;
    }
    return baseClass;
  }

  getSlideType(slideIndex: number): string {
    return this.visibleSlides[slideIndex]?.type || '';
  }

  // Métodos para controlar el auto-slide
  pauseAutoSlide(): void {
    this.autoSlideActive$.next(false);
  }

  resumeAutoSlide(): void {
    this.autoSlideActive$.next(true);
  }

  private setupAutoSlide(): void {
    this.autoSlideActive$
      .pipe(
        startWith(true),
        switchMap(isActive =>
          isActive ? interval(this.autoSlideInterval) : EMPTY
        ),
        tap(() => this.nextSlide()),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private restartAutoSlide(): void {
    // Pausar y reanudar para reiniciar el timer
    this.autoSlideActive$.next(false);
    // Usar setTimeout con delay mínimo para que el switchMap procese el cambio
    if (this.isBrowser) {
      setTimeout(() => this.autoSlideActive$.next(true), 0);
    }
  }

  private validateSlideIndex(): void {
    if (this.currentSlide >= this.totalSlides) {
      this.currentSlide = Math.max(0, this.totalSlides - 1);
    }
  }

  private isValidSlideIndex(index: number): boolean {
    return index >= 0 && index < this.totalSlides;
  }

}
