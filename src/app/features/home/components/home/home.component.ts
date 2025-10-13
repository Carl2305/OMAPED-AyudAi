import { Component, OnInit } from '@angular/core';
import { CardSocialComponent } from "./card-social/card-social.component";
import { CardSliderComponent } from "./card-slider/card-slider.component";
import { NgClass, NgFor, NgIf } from '@angular/common';

interface Credit {
  operation_id: number;
  currency: string;
  current_debt: number;
  next_fee: number;
  fees_paid: number;
  total_fees: number;
  expiration_date: string;
  isExpanded?: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, CardSocialComponent, CardSliderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  credits: Credit[] = [];

  ngOnInit() {
    this.loadCredits();
  }

  loadCredits() {
    // Simulamos la carga del JSON
    const creditData = {
      "credits": [
        {
          "operation_id": 1555759,
          "currency": "USD",
          "current_debt": 13933.66,
          "next_fee": 70.97,
          "fees_paid": 4,
          "total_fees": 12,
          "expiration_date": "2025-03-15"
        },
        {
          "operation_id": 1555760,
          "currency": "USD",
          "current_debt": 5000.00,
          "next_fee": 25.00,
          "fees_paid": 2,
          "total_fees": 48,
          "expiration_date": "2024-12-01"
        },
        {
          "operation_id": 1555761,
          "currency": "USD",
          "current_debt": 0.00,
          "next_fee": 0.00,
          "fees_paid": 24,
          "total_fees": 24,
          "expiration_date": "2024-08-15"
        },
        {
          "operation_id": 1555762,
          "currency": "USD",
          "current_debt": 850.00,
          "next_fee": 425.00,
          "fees_paid": 34,
          "total_fees": 36,
          "expiration_date": "2025-01-30"
        }
      ]
    };

    this.credits = creditData.credits.map((credit, index) => ({
      ...credit,
      isExpanded: index === 0 // Solo el primer card se muestra expandido por defecto
    }));
  }

  toggleCard(credit: Credit) {
    // Si la tarjeta ya está expandida, la colapsamos
    if (credit.isExpanded) {
      credit.isExpanded = false;
    } else {
      // Colapsamos todas las demás tarjetas
      this.credits.forEach(c => c.isExpanded = false);
      // Expandimos solo la tarjeta seleccionada
      credit.isExpanded = true;
    }
  }

  calculateProgress(feesPaid: number, totalFees: number): number {
    return Math.round((feesPaid / totalFees) * 100);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                   'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  formatCurrency(amount: number): string {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  getCardGradient(index: number): string {
    // Color expandido: #D1ECF9
    return '#D1ECF9';
  }

  isOverdue(expirationDate: string): boolean {
    const today = new Date();
    const expDate = new Date(expirationDate);
    return expDate < today;
  }

  getCardCollapsedGradient(index: number): string {
    // Color colapsado: #EFF0F0
    return '#EFF0F0';
  }

  isPaidOff(credit: Credit): boolean {
    return credit.fees_paid >= credit.total_fees && credit.current_debt === 0;
  }

  getStatusText(credit: Credit): string {
    if (this.isPaidOff(credit)) {
      return '✅ Pagado';
    } else if (this.isOverdue(credit.expiration_date)) {
      return '⚠️ Vencido';
    } else {
      return '✅ Al día';
    }
  }

  // Métodos para manejar las acciones de los botones
  payInstallment(operationId: number): void {
    console.log(`Pagando cuota para la operación: ${operationId}`);
    // Implementar lógica para pagar cuota
  }

  downloadContract(operationId: number): void {
    console.log(`Descargando contrato para la operación: ${operationId}`);
    // Implementar lógica para descargar contrato
  }

  viewSchedule(operationId: number): void {
    console.log(`Viendo cronograma para la operación: ${operationId}`);
    // Implementar lógica para ver cronograma
  }

  downloadAccountStatus(operationId: number): void {
    console.log(`Descargando estado de cuenta de la operación: ${operationId}`);
    // Implementar lógica para descargar estado de cuenta
  }

  downloadNoDebtLetter(operationId: number): void {
    console.log(`Descargando carta de no adeudo de la operación: ${operationId}`);
    // Implementar lógica para descargar carta de no adeudo
  }

  downloadGuaranteeRelease(operationId: number): void {
    console.log(`Descargando carta de levantamiento de garantía de la operación: ${operationId}`);
    // Implementar lógica para descargar levantamiento de garantía
  }

}
