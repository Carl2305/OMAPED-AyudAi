import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassificationPrioritizationService } from '@features/classification-prioritization/services/classification-prioritization.service';
import { ShapExplanationResponse, ShapFeatureExplanation } from '@features/classification-prioritization/models/shap-explanation.interface';

@Component({
  selector: 'app-shap-explanation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shap-explanation-modal.component.html',
  styleUrl: './shap-explanation-modal.component.scss'
})
export class ShapExplanationModalComponent implements OnInit {
  @Input() beneficiarioId!: number;
  @Input() beneficiarioNombre!: string;
  @Output() closeModal = new EventEmitter<void>();

  shapData: ShapExplanationResponse | null = null;
  isLoading = false;
  errorMessage = '';

  // Características ordenadas por impacto absoluto
  topFeatures: ShapFeatureExplanation[] = [];

  constructor(
    private classificationService: ClassificationPrioritizationService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadShapExplanation();
  }

  /**
   * Carga la explicación SHAP del beneficiario
   */
  async loadShapExplanation(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const response = await this.classificationService.getShapExplanation(this.beneficiarioId);

      if (response.success && response.data) {
        this.shapData = response.data;
        
        // Ordenar características por valor absoluto de SHAP (impacto)
        this.topFeatures = [...this.shapData.shap_explicaciones]
          .sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value))
          .slice(0, 10); // Top 10 características más influyentes

        console.log('✅ Explicación SHAP cargada:', this.shapData);
      } else {
        this.errorMessage = response.message || 'No se pudo cargar la explicación SHAP';
      }
    } catch (error) {
      console.error('❌ Error al cargar explicación SHAP:', error);
      this.errorMessage = 'Error al cargar la explicación SHAP. Por favor, intenta nuevamente.';
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Cierra el modal
   */
  close(): void {
    this.closeModal.emit();
  }

  /**
   * Obtiene el color según el nivel de riesgo
   */
  getRiskColor(nivel: string): string {
    switch (nivel) {
      case 'ALTO': return '#dc2626'; // rojo
      case 'MEDIO': return '#f59e0b'; // amarillo/naranja
      case 'BAJO': return '#10b981'; // verde
      default: return '#6b7280'; // gris
    }
  }

  /**
   * Obtiene el ancho de la barra según el valor SHAP
   */
  getBarWidth(shapValue: number): number {
    const maxAbsValue = Math.max(
      ...this.topFeatures.map(f => Math.abs(f.shap_value))
    );
    
    if (maxAbsValue === 0) return 0;
    
    return (Math.abs(shapValue) / maxAbsValue) * 100;
  }

  /**
   * Obtiene el color de la barra según el impacto
   */
  getBarColor(impact: string): string {
    switch (impact) {
      case 'positive': return '#10b981'; // verde - reduce riesgo
      case 'negative': return '#dc2626'; // rojo - aumenta riesgo
      case 'neutral': return '#d1d5db'; // gris - neutral
      default: return '#d1d5db';
    }
  }

  /**
   * Formatea el nombre de la característica para mostrar
   */
  getFeatureLabel(featureName: string): string {
    const labels: { [key: string]: string } = {
      'edad_texto': 'Edad',
      'sexo_etiqueta': 'Sexo',
      'grado_instruccion': 'Grado de Instrucción',
      'labora_actualmente': 'Labora Actualmente',
      'grado_discapacidad': 'Grado de Discapacidad',
      'dependencia_funcional': 'Dependencia Funcional',
      'tipo_discapacidad_Auditiva': 'Discapacidad Auditiva',
      'tipo_discapacidad_Física o motora': 'Discapacidad Física/Motora',
      'tipo_discapacidad_Intelectual': 'Discapacidad Intelectual',
      'tipo_discapacidad_Mental o psicosocial': 'Discapacidad Mental/Psicosocial',
      'tipo_discapacidad_Visual': 'Discapacidad Visual',
      'tipo_discapacidad_Múltiple': 'Discapacidad Múltiple'
    };

    return labels[featureName] || featureName.replace(/_/g, ' ');
  }

  /**
   * Formatea el valor de la característica
   */
  getFeatureValueLabel(featureName: string, value: string): string {
    // Para características booleanas (0/1)
    if (value === '0') return 'No';
    if (value === '1') return 'Sí';
    
    return value;
  }

  /**
   * Formatea el porcentaje de confianza
   */
  getConfidencePercentage(): string {
    if (!this.shapData) return '0%';
    return `${(this.shapData.confianza * 100).toFixed(1)}%`;
  }

  /**
   * Calcula el IPO (Índice Prioridad Operativa)
   */
  getIPO(): number {
    if (!this.shapData) return 0;
    // El IPO se calcula como confianza * 100
    return Math.round(this.shapData.confianza * 100);
  }

  /**
   * Formatea el label del porcentaje para mostrar
   */
  getPercentageLabel(shapValue: number): string {
    const percentage = (shapValue * 100).toFixed(1);
    return shapValue > 0 ? `+${percentage}%` : `${percentage}%`;
  }

  /**
   * Formatea la fecha de predicción
   */
  getFormattedDate(): string {
    if (!this.shapData) return '';
    
    const date = new Date(this.shapData.fecha_prediccion);
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
