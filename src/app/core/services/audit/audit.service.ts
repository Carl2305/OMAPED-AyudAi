import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { firstValueFrom } from 'rxjs';
import { AuditRequest, AuditFieldChange, AuditFieldConfig } from '@core/models/audit/audit-change.interface';
import { AuditResponse } from '@core/models/audit/audit-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private readonly apiUrl = `${environment.apiUrl}/auditoria`;

  // Configuración de campos para nombres legibles
  private readonly fieldLabels: { [key: string]: string } = {
    // Identidad y Datos Básicos
    'nombres_completos': 'Nombres Completos',
    'edad_texto': 'Edad',
    'tipo_documento_codigo': 'Tipo de Documento',
    'numero_documento': 'Número de Documento',
    'id_nacionalidad': 'Nacionalidad',
    'nacionalidad_otro': 'Otra Nacionalidad',
    'sexo': 'Sexo',
    'fecha_nacimiento': 'Fecha de Nacimiento',
    'telefono': 'Teléfono',
    'correo_electronico': 'Correo Electrónico',
    
    // Ubigeo y Domicilio
    'id_departamento': 'Departamento',
    'id_provincia': 'Provincia',
    'id_distrito': 'Distrito',
    'id_estado_civil': 'Estado Civil',
    'tiene_hijos': 'Tiene Hijos',
    'numero_hijos': 'Número de Hijos',
    'direccion_actual': 'Dirección Actual',
    'referencia': 'Referencia',
    
    // Discapacidad
    'tiene_carnet_conadis': 'Tiene Carnet CONADIS',
    'numero_carnet_conadis': 'Número de Carnet CONADIS',
    'tiene_certificado_discapacidad': 'Tiene Certificado de Discapacidad',
    'id_grado_discapacidad': 'Grado de Discapacidad',
    'id_grado_dependencia': 'Grado de Dependencia',
    'id_tipo_discapacidad': 'Tipo de Discapacidad',
    'discapacidad_otro': 'Otra Discapacidad',
    'cie10': 'CIE-10',
    'id_causa_discapacidad': 'Causa de Discapacidad',
    'id_ayuda_biomecanica': 'Ayuda Biomecánica',
    
    // Salud y Tratamiento
    'recibe_atencion_medica': 'Recibe Atención Médica',
    'toma_medicamentos': 'Toma Medicamentos',
    'tratamiento': 'Tratamiento',
    'otras_personas_discapacidad': 'Otras Personas con Discapacidad',
    'cuantas_personas_discapacidad': 'Cantidad de Personas con Discapacidad',
    'id_seguro': 'Tipo de Seguro',
    
    // Educación y Trabajo
    'labora_actualmente': 'Labora Actualmente',
    'lugar_trabajo': 'Lugar de Trabajo',
    'id_rango_salarial': 'Rango Salarial',
    'funcion_desempena': 'Función que Desempeña',
    'id_grado_instruccion': 'Grado de Instrucción',
    'centro_estudios': 'Centro de Estudios',
    'carrera': 'Carrera',
    'idiomas': 'Idiomas',
    'id_tipo_apoyo': 'Tipo de Apoyo',
    'id_actividad_deportiva': 'Actividad Deportiva',
    'recibio_test_vocacional': 'Recibió Test Vocacional',
    'test_vocacional_donde': 'Dónde Recibió Test Vocacional',
    
    // Vivienda y Convivencia
    'id_condicion_vivienda': 'Condición de Vivienda',
    'id_tipo_vivienda': 'Tipo de Vivienda',
    'id_con_quien_vive': 'Con Quién Vive',
    'id_programa_social': 'Programa Social',
    
    // Apoderado
    'apoderado_nombres': 'Nombres del Apoderado',
    'apoderado_id_parentesco': 'Parentesco del Apoderado',
    'apoderado_tipo_documento': 'Tipo de Documento del Apoderado',
    'apoderado_numero_documento': 'Número de Documento del Apoderado',
    'apoderado_telefono': 'Teléfono del Apoderado',
    'apoderado_direccion': 'Dirección del Apoderado',
    
    // Arrays especiales
    'servicios_basicos': 'Servicios Básicos'
  };

  // Campos que deben ser ignorados en la auditoría
  private readonly ignoredFields: string[] = [
    'edad_texto', // Se calcula automáticamente
  ];

  constructor(private http: HttpClient) {}

  /**
   * Registra una auditoría de cambio en un beneficiario
   * @param tipoOperacion - Tipo de operación (CREACION, ACTUALIZACION)
   * @param beneficiaryId - ID del beneficiario
   * @param originalData - Datos originales (antes del cambio)
   * @param newData - Datos nuevos (después del cambio)
   */
  async auditBeneficiaryChange(
    tipoOperacion: 'CREACION' | 'ACTUALIZACION',
    beneficiaryId: number,
    originalData: any,
    newData: any
  ): Promise<void> {
    try {
      const cambios = this.detectChanges(originalData, newData, tipoOperacion);

      // Si no hay cambios, no registrar auditoría
      if (cambios.length === 0) {
        console.log('No se detectaron cambios para auditar');
        return;
      }

      const auditRequest: AuditRequest = {
        tipoOperacion,
        modulo: 'BENEFICIARIO',
        entidadId: beneficiaryId,
        entidadTipo: 'Beneficiario',
        cambios,
        metadata: {
          timestamp: new Date().toISOString(),
          navegador: this.getBrowserInfo()
        }
      };

      console.log('Enviando auditoría:', auditRequest);

      const response = await firstValueFrom(
        this.http.post<AuditResponse>(`${this.apiUrl}`, auditRequest)
      );

      console.log('Auditoría registrada exitosamente:', response);
    } catch (error) {
      // No fallar la operación principal si falla la auditoría
      console.error('Error al registrar auditoría (no crítico):', error);
    }
  }

  /**
   * Detecta los cambios entre dos objetos de datos
   * @param original - Datos originales
   * @param nuevo - Datos nuevos
   * @param tipoOperacion - Tipo de operación
   * @returns Array de cambios detectados
   */
  private detectChanges(
    original: any,
    nuevo: any,
    tipoOperacion: 'CREACION' | 'ACTUALIZACION'
  ): AuditFieldChange[] {
    const cambios: AuditFieldChange[] = [];

    // En CREACION, todos los campos con valor son cambios
    if (tipoOperacion === 'CREACION') {
      return this.detectCreationChanges(nuevo);
    }

    // En ACTUALIZACION, comparar valores
    return this.detectUpdateChanges(original, nuevo);
  }

  /**
   * Detecta cambios en una operación de CREACION
   * Solo registra campos que tienen valor (no nulos, no vacíos, no false)
   */
  private detectCreationChanges(data: any): AuditFieldChange[] {
    const cambios: AuditFieldChange[] = [];

    // Procesar beneficiario
    if (data.beneficiario) {
      Object.keys(data.beneficiario).forEach(key => {
        if (this.shouldAuditField(key, data.beneficiario[key])) {
          cambios.push({
            campo: key,
            campoLegible: this.getFieldLabel(key),
            valorAnterior: null,
            valorNuevo: data.beneficiario[key],
            tipoCambio: 'CREADO'
          });
        }
      });
    }

    // Procesar servicios_basicos (array)
    if (data.servicios_basicos && Array.isArray(data.servicios_basicos) && data.servicios_basicos.length > 0) {
      cambios.push({
        campo: 'servicios_basicos',
        campoLegible: this.getFieldLabel('servicios_basicos'),
        valorAnterior: null,
        valorNuevo: data.servicios_basicos,
        tipoCambio: 'CREADO'
      });
    }

    // Procesar apoderado (si existe)
    if (data.apoderado) {
      Object.keys(data.apoderado).forEach(key => {
        if (this.shouldAuditField(key, data.apoderado[key])) {
          cambios.push({
            campo: key,
            campoLegible: this.getFieldLabel(key),
            valorAnterior: null,
            valorNuevo: data.apoderado[key],
            tipoCambio: 'CREADO'
          });
        }
      });
    }

    return cambios;
  }

  /**
   * Detecta cambios en una operación de ACTUALIZACION
   * Compara valores originales vs nuevos
   */
  private detectUpdateChanges(original: any, nuevo: any): AuditFieldChange[] {
    const cambios: AuditFieldChange[] = [];

    // Comparar beneficiario
    if (original?.beneficiario && nuevo?.beneficiario) {
      const changesBeneficiario = this.compareObjects(
        original.beneficiario,
        nuevo.beneficiario
      );
      cambios.push(...changesBeneficiario);
    }

    // Comparar servicios_basicos (array especial)
    if (original?.servicios_basicos !== undefined || nuevo?.servicios_basicos !== undefined) {
      const arrayChange = this.compareArrays(
        original?.servicios_basicos || [],
        nuevo?.servicios_basicos || [],
        'servicios_basicos'
      );
      if (arrayChange) {
        cambios.push(arrayChange);
      }
    }

    // Comparar apoderado
    if (original?.apoderado || nuevo?.apoderado) {
      const changesApoderado = this.compareObjects(
        original?.apoderado || {},
        nuevo?.apoderado || {}
      );
      cambios.push(...changesApoderado);
    }

    return cambios;
  }

  /**
   * Compara dos objetos y retorna los campos que cambiaron
   */
  private compareObjects(original: any, nuevo: any): AuditFieldChange[] {
    const cambios: AuditFieldChange[] = [];
    const allKeys = new Set([...Object.keys(original || {}), ...Object.keys(nuevo || {})]);

    allKeys.forEach(key => {
      // Ignorar campos excluidos
      if (this.ignoredFields.includes(key)) {
        return;
      }

      const valorAnterior = original?.[key];
      const valorNuevo = nuevo?.[key];

      // Comparar valores (maneja null, undefined, strings vacíos, etc.)
      if (!this.areValuesEqual(valorAnterior, valorNuevo)) {
        let tipoCambio: 'CREADO' | 'MODIFICADO' | 'ELIMINADO';

        if (this.isEmptyValue(valorAnterior) && !this.isEmptyValue(valorNuevo)) {
          tipoCambio = 'CREADO';
        } else if (!this.isEmptyValue(valorAnterior) && this.isEmptyValue(valorNuevo)) {
          tipoCambio = 'ELIMINADO';
        } else {
          tipoCambio = 'MODIFICADO';
        }

        cambios.push({
          campo: key,
          campoLegible: this.getFieldLabel(key),
          valorAnterior,
          valorNuevo,
          tipoCambio
        });
      }
    });

    return cambios;
  }

  /**
   * Compara dos arrays
   */
  private compareArrays(original: any[], nuevo: any[], fieldName: string): AuditFieldChange | null {
    // Normalizar arrays
    const arrOriginal = Array.isArray(original) ? original : [];
    const arrNuevo = Array.isArray(nuevo) ? nuevo : [];

    // Comparar contenido
    if (!this.areArraysEqual(arrOriginal, arrNuevo)) {
      let tipoCambio: 'CREADO' | 'MODIFICADO' | 'ELIMINADO';

      if (arrOriginal.length === 0 && arrNuevo.length > 0) {
        tipoCambio = 'CREADO';
      } else if (arrOriginal.length > 0 && arrNuevo.length === 0) {
        tipoCambio = 'ELIMINADO';
      } else {
        tipoCambio = 'MODIFICADO';
      }

      return {
        campo: fieldName,
        campoLegible: this.getFieldLabel(fieldName),
        valorAnterior: arrOriginal,
        valorNuevo: arrNuevo,
        tipoCambio
      };
    }

    return null;
  }

  /**
   * Verifica si dos valores son iguales (maneja tipos primitivos, null, undefined)
   */
  private areValuesEqual(value1: any, value2: any): boolean {
    // Si ambos son "vacíos" (null, undefined, '', 0, false), se consideran iguales
    if (this.isEmptyValue(value1) && this.isEmptyValue(value2)) {
      return true;
    }

    // Comparación estricta
    return value1 === value2;
  }

  /**
   * Verifica si dos arrays son iguales
   */
  private areArraysEqual(arr1: any[], arr2: any[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }

    // Ordenar y comparar (para arrays de números/strings)
    const sorted1 = [...arr1].sort();
    const sorted2 = [...arr2].sort();

    return JSON.stringify(sorted1) === JSON.stringify(sorted2);
  }

  /**
   * Verifica si un valor es "vacío" (null, undefined, '', 0, false)
   * IMPORTANTE: Para números, considerar 0 como valor válido en algunos contextos
   */
  private isEmptyValue(value: any): boolean {
    return value === null || 
           value === undefined || 
           value === '' || 
           (typeof value === 'number' && value === 0 && value !== 0) || // Solo si es explícitamente vacío
           (typeof value === 'boolean' && value === false);
  }

  /**
   * Determina si un campo debe ser auditado
   */
  private shouldAuditField(key: string, value: any): boolean {
    // No auditar campos ignorados
    if (this.ignoredFields.includes(key)) {
      return false;
    }

    // No auditar valores vacíos/null/undefined
    if (this.isEmptyValue(value)) {
      return false;
    }

    return true;
  }

  /**
   * Obtiene el nombre legible de un campo
   */
  private getFieldLabel(field: string): string {
    return this.fieldLabels[field] || field;
  }

  /**
   * Obtiene información del navegador
   */
  private getBrowserInfo(): string {
    return navigator.userAgent;
  }
}
