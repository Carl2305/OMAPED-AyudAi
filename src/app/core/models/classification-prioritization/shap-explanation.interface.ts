/**
 * Interfaz para la explicación individual de una característica SHAP
 */
export interface ShapFeatureExplanation {
  feature_name: string;
  feature_value: string;
  shap_value: number;
  impact: 'positive' | 'negative' | 'neutral';
  orden: number;
  descripcion_impacto: string;
  importancia_relativa: string;
}

/**
 * Interfaz para la respuesta completa de explicación SHAP
 */
export interface ShapExplanationResponse {
  nivel_riesgo: 'BAJO' | 'MEDIO' | 'ALTO';
  confianza: number;
  fecha_prediccion: string;
  shap_explicaciones: ShapFeatureExplanation[];
}

/**
 * Interfaz para los datos de entrada del modal
 */
export interface ShapModalData {
  beneficiarioId: number;
  beneficiarioNombre: string;
}
