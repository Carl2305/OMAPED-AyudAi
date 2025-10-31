import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BeneficiaryRegistrationService } from '@features/beneficiary-registration/services/beneficiary-registration.service';
import { ConfirmationDialogService } from '@shared/utils/services/confirmation-dialog/confirmation-dialog.service';
import { BeneficiaryResponse } from '@core/models/beneficiary/beneficiary-response.interface';

@Component({
  selector: 'app-beneficiary-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './beneficiary-registration.component.html',
  styleUrl: './beneficiary-registration.component.scss',
})
export class BeneficiaryRegistrationComponent implements OnInit {
  beneficiaryForm!: FormGroup;
  currentStep: number = 1;
  totalSteps: number = 6; // 6 pasos, apoderado va en paso 2
  isDisabled: boolean = true;
  isEditMode: boolean = false; // Indica si estamos editando un beneficiario existente
  currentBeneficiaryId: number | null = null; // ID del beneficiario en modo edición

  //#region  data static
  // Catálogos según BD - Estos vendrán del backend
  tiposDocumento = [
    { codigo: '001', nombre: 'DNI' },
    { codigo: '002', nombre: 'Carnet de Extranjería' },
    { codigo: '003', nombre: 'Pasaporte' },
  ];

  nacionalidades = [
    { id: 1, nombre: 'Peruana' },
    { id: 2, nombre: 'Venezolana' },
    { id: 3, nombre: 'Colombiana' },
    { id: 4, nombre: 'Otra' },
  ];

  generos = [
    { value: 'MASCULINO', label: 'Masculino' },
    { value: 'FEMENINO', label: 'Femenino' },
    { value: 'NO_DECLARA', label: 'Prefiero no decir' },
  ];

  estadosCiviles = [
    { id: 1, nombre: 'Soltero(a)' },
    { id: 2, nombre: 'Casado(a)' },
    { id: 3, nombre: 'Divorciado(a)' },
    { id: 4, nombre: 'Viudo(a)' },
    { id: 5, nombre: 'Conviviente' },
  ];

  departamentos = [
    { id: 1, nombre: 'Lima', codigo: '15' },
    { id: 2, nombre: 'Piura', codigo: '20' },
  ];

  provincias: any[] = [
    { id: 1, nombre: 'Paita', departamento_codigo: 2 },
    { id: 2, nombre: 'Sullana', departamento_codigo: 2 },
  ];
  distritos: any[] = [
    { id: 1, nombre: 'Marcavelica', provincia_codigo: 2 },
  ];

  gradosDiscapacidad = [
    { id: 1, nombre: 'Leve' },
    { id: 2, nombre: 'Moderado' },
    { id: 3, nombre: 'Grave' },
    { id: 4, nombre: 'Muy Grave' },
  ];

  tiposDiscapacidad = [
    { id: 1, nombre: 'Física o motora' },
    { id: 2, nombre: 'Visual' },
    { id: 3, nombre: 'Auditiva' },
    { id: 4, nombre: 'Intelectual' },
    { id: 5, nombre: 'Mental o psicosocial' },
    { id: 6, nombre: 'Múltiple' },
    { id: 7, nombre: 'Otro' },
  ];

  causasDiscapacidad = [
    { id: 1, nombre: 'Congénita' },
    { id: 2, nombre: 'Enfermedad' },
    { id: 3, nombre: 'Accidente' },
    { id: 4, nombre: 'Violencia' },
    { id: 5, nombre: 'Otra' },
  ];

  ayudasBiomecanicas = [
    { id: 1, nombre: 'Silla de ruedas' },
    { id: 2, nombre: 'Bastón' },
    { id: 3, nombre: 'Muletas' },
    { id: 4, nombre: 'Prótesis' },
    { id: 5, nombre: 'Audífono' },
    { id: 6, nombre: 'Ninguna' },
  ];

  gradosInstruccion = [
    { id: 1, nombre: 'Sin estudios' },
    { id: 2, nombre: 'Primaria incompleta' },
    { id: 3, nombre: 'Primaria completa' },
    { id: 4, nombre: 'Secundaria incompleta' },
    { id: 5, nombre: 'Secundaria completa' },
    { id: 6, nombre: 'Superior técnica incompleta' },
    { id: 7, nombre: 'Superior técnica completa' },
    { id: 8, nombre: 'Superior universitaria incompleta' },
    { id: 9, nombre: 'Superior universitaria completa' },
  ];

  tiposApoyo = [
    { id: 1, nombre: 'Económico' },
    { id: 2, nombre: 'Psicológico' },
    { id: 3, nombre: 'Legal' },
    { id: 4, nombre: 'Laboral' },
    { id: 5, nombre: 'Educativo' },
    { id: 6, nombre: 'Ninguno' },
  ];

  actividadesDeportivas = [
    { id: 1, nombre: 'Fútbol' },
    { id: 2, nombre: 'Natación' },
    { id: 3, nombre: 'Atletismo' },
    { id: 4, nombre: 'Básquet' },
    { id: 5, nombre: 'Ninguna' },
  ];

  condicionesVivienda = [
    { id: 1, nombre: 'Propia' },
    { id: 2, nombre: 'Alquilada' },
    { id: 3, nombre: 'Familiar' },
    { id: 4, nombre: 'Otra' },
  ];

  tiposVivienda = [
    { id: 1, nombre: 'Casa independiente' },
    { id: 2, nombre: 'Departamento' },
    { id: 3, nombre: 'Cuarto' },
    { id: 4, nombre: 'Vivienda precaria' },
  ];

  serviciosBasicos = [
    { id: 1, nombre: 'Agua potable' },
    { id: 2, nombre: 'Desagüe' },
    { id: 3, nombre: 'Luz eléctrica' },
    { id: 4, nombre: 'Internet' },
    { id: 5, nombre: 'Teléfono' },
  ];

  opcionesConQuienVive = [
    { id: 1, descripcion: 'Solo(a)' },
    { id: 2, descripcion: 'Con padres' },
    { id: 3, descripcion: 'Con pareja' },
    { id: 4, descripcion: 'Con hijos' },
    { id: 5, descripcion: 'Con familiares' },
  ];

  tiposSeguros = [
    { id: 1, nombre: 'SIS' },
    { id: 2, nombre: 'EsSalud' },
    { id: 3, nombre: 'Seguro privado' },
    { id: 4, nombre: 'Ninguno' },
  ];

  programasSociales = [
    { id: 1, nombre: 'Pensión 65' },
    { id: 2, nombre: 'Juntos' },
    { id: 3, nombre: 'Qali Warma' },
    { id: 4, nombre: 'Contigo' },
    { id: 5, nombre: 'Ninguno' },
  ];

  parentescos = [
    { id: 1, nombre: 'Padre' },
    { id: 2, nombre: 'Madre' },
    { id: 3, nombre: 'Hermano(a)' },
    { id: 4, nombre: 'Hijo(a)' },
    { id: 5, nombre: 'Cónyuge' },
    { id: 6, nombre: 'Tutor legal' },
    { id: 7, nombre: 'Otro' },
  ];

  //#endregion

  selectedServiciosBasicos: number[] = [];
  mostrarApoderado: boolean = false; // Control para mostrar/ocultar sección apoderado

  constructor(
    private fb: FormBuilder, 
    private beneficiaryRegistrationService: BeneficiaryRegistrationService,
    private confirmationDialogService: ConfirmationDialogService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.beneficiaryForm = this.fb.group({
      // 🟦 PASO 1: IDENTIDAD Y DATOS BÁSICOS
      nombres_completos: ['', [Validators.required, Validators.minLength(3)]],
      edad_texto: [''],
      tipo_documento_codigo: ['001', Validators.required],
      numero_documento: ['', [Validators.required, Validators.minLength(6)]],
      id_nacionalidad: ['', Validators.required],
      nacionalidad_otro: [''],
      sexo: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      telefono: ['', Validators.pattern(/^9[0-9]{8}$/)],
      correo_electronico: ['', Validators.email],

      // 🟦 PASO 2: UBIGEO Y DOMICILIO
      id_departamento: ['', Validators.required],
      id_provincia: ['', Validators.required],
      id_distrito: ['', Validators.required],
      id_estado_civil: ['', Validators.required],
      tiene_hijos: [false],
      numero_hijos: [null],
      direccion_actual: [''],
      referencia: [''],

      // 🟦 PASO 3: DISCAPACIDAD
      tiene_carnet_conadis: [false, Validators.required],
      numero_carnet_conadis: [''],
      tiene_certificado_discapacidad: [false, Validators.required],
      id_grado_discapacidad: [null],
      id_tipo_discapacidad: [null],
      discapacidad_otro: [''],
      cie10: [''],
      id_causa_discapacidad: [null],
      id_ayuda_biomecanica: [null],

      // 🟦 PASO 4: SALUD Y TRATAMIENTO
      recibe_atencion_medica: [false],
      toma_medicamentos: [false],
      tratamiento: [''],
      otras_personas_discapacidad: [false],
      cuantas_personas_discapacidad: [null],
      id_seguro: [null],

      // 🟦 PASO 5: EDUCACIÓN Y TRABAJO
      labora_actualmente: [false],
      lugar_trabajo: [''],
      funcion_desempena: [''],
      id_grado_instruccion: [null],
      centro_estudios: [''],
      carrera: [''],
      idiomas: [''],
      id_tipo_apoyo: [null],
      id_actividad_deportiva: [null],
      recibio_test_vocacional: [false],
      test_vocacional_donde: [''],

      // 🟦 PASO 6: VIVIENDA Y CONVIVENCIA
      id_condicion_vivienda: [null],
      id_tipo_vivienda: [null],
      id_con_quien_vive: [null],
      id_programa_social: [null],

      // 🟦 APODERADO (opcional - va en Paso 2)
      apoderado_nombres: [''],
      apoderado_id_parentesco: [null],
      apoderado_tipo_documento: ['001'],
      apoderado_numero_documento: [''],
      apoderado_telefono: [''],
      apoderado_direccion: [''],
    });

    this.setupConditionalValidators();
    this.setLockedForm(this.isDisabled);
  }

  setupConditionalValidators(): void {
    // Si tiene hijos, el número es requerido
    this.beneficiaryForm.get('tiene_hijos')?.valueChanges.subscribe((value) => {
      const control = this.beneficiaryForm.get('numero_hijos');
      if (value) {
        control?.setValidators([Validators.required, Validators.min(1)]);
      } else {
        control?.clearValidators();
        control?.setValue(null);
      }
      control?.updateValueAndValidity();
    });

    // Si tiene carnet CONADIS, el número es requerido
    this.beneficiaryForm
      .get('tiene_carnet_conadis')
      ?.valueChanges.subscribe((value) => {
        const control = this.beneficiaryForm.get('numero_carnet_conadis');
        if (value) {
          control?.setValidators(Validators.required);
        } else {
          control?.clearValidators();
          control?.setValue('');
        }
        control?.updateValueAndValidity();
      });

    // Si nacionalidad es "Otra", el campo otro es requerido
    this.beneficiaryForm
      .get('id_nacionalidad')
      ?.valueChanges.subscribe((value) => {
        const control = this.beneficiaryForm.get('nacionalidad_otro');
        if (value === 4) {
          control?.setValidators(Validators.required);
        } else {
          control?.clearValidators();
          control?.setValue('');
        }
        control?.updateValueAndValidity();
      });

    // Si labora, lugar y función son requeridos
    this.beneficiaryForm
      .get('labora_actualmente')
      ?.valueChanges.subscribe((value) => {
        const lugarControl = this.beneficiaryForm.get('lugar_trabajo');
        const funcionControl = this.beneficiaryForm.get('funcion_desempena');
        if (value) {
          lugarControl?.setValidators(Validators.required);
          funcionControl?.setValidators(Validators.required);
        } else {
          lugarControl?.clearValidators();
          funcionControl?.clearValidators();
        }
        lugarControl?.updateValueAndValidity();
        funcionControl?.updateValueAndValidity();
      });

    // Si marca que necesita apoderado, validar campos del apoderado
    // Esta lógica se puede agregar si se necesita
  }

  setLockedForm(lock: boolean) {
    const names = ['nombres_completos', 'id_nacionalidad', 'nacionalidad_otro', 'sexo', 'fecha_nacimiento',
    'edad_texto', 'telefono', 'correo_electronico', 'id_departamento', 'id_provincia', 'id_distrito', 'id_estado_civil',
    'tiene_hijos', 'numero_hijos', 'direccion_actual', 'referencia', 'apoderado_nombres', 'apoderado_id_parentesco', 
    'apoderado_tipo_documento', 'tiene_carnet_conadis', 'apoderado_numero_documento', 'apoderado_telefono', 'apoderado_direccion',
    'tiene_carnet_conadis', 'numero_carnet_conadis', 'tiene_certificado_discapacidad', 'id_grado_discapacidad', 'id_tipo_discapacidad', 
    'discapacidad_otro', 'id_causa_discapacidad', 'id_ayuda_biomecanica', 'recibe_atencion_medica', 'toma_medicamentos', 
    'tratamiento', 'otras_personas_discapacidad', 'cuantas_personas_discapacidad', 'id_seguro', 'id_grado_instruccion', 
    'centro_estudios', 'carrera', 'idiomas', 'recibio_test_vocacional',  'test_vocacional_donde', 'labora_actualmente', 
    'lugar_trabajo', 'funcion_desempena', 'id_tipo_apoyo', 'id_actividad_deportiva', 'id_condicion_vivienda', 'id_tipo_vivienda', 
    'id_con_quien_vive', 'id_programa_social', 'cie10'
    ];

    names.forEach(n => {
      const c = this.beneficiaryForm.get(n);
      if (!c) return;
      lock ? c.disable({ emitEvent: false }) : c.enable({ emitEvent: false });
    });
  }

  toggleApoderado(): void {
    this.mostrarApoderado = !this.mostrarApoderado;
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep = step;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  async validateExistsBeneficiary(): Promise<void> {

    if (this.beneficiaryForm.value.tipo_documento_codigo === '') {
      this.confirmationDialogService.showWarning(
        'Tipo de Documento Requerido',
        'Por favor seleccione un tipo de documento antes de buscar.'
      ).subscribe();
      return;
    }

    if (this.numero_documento?.invalid) {
      this.confirmationDialogService.showWarning(
        'Número de Documento Inválido',
        'Por favor ingrese un número de documento válido antes de buscar.'
      ).subscribe();
      this.numero_documento?.markAsTouched();
      return;
    }

    const response = await this.beneficiaryRegistrationService.getValidateExistsBeneficiary(
      this.beneficiaryForm.value.tipo_documento_codigo,
      this.beneficiaryForm.value.numero_documento
    );

    if (response.data) {
      // El beneficiario ya existe - preguntar si desea cargar los datos
      this.confirmationDialogService.showConfirm(
        'Beneficiario Ya Registrado',
        'El beneficiario ya está registrado en el sistema. ¿Desea cargar los datos existentes para visualizarlos o actualizarlos?',
        'Sí, cargar datos',
        'No, cancelar'
      ).subscribe(async (cargarDatos) => {
        if (cargarDatos) {
          try {
            // Obtener los datos completos del beneficiario
            const beneficiaryResponse = await this.beneficiaryRegistrationService.getBeneficiaryByDocument(
              this.beneficiaryForm.value.tipo_documento_codigo,
              this.beneficiaryForm.value.numero_documento
            );

            if (beneficiaryResponse.data) {
              // Cargar los datos en el formulario
              this.loadBeneficiaryData(beneficiaryResponse.data);
              
              this.confirmationDialogService.showSuccess(
                'Datos Cargados',
                'Los datos del beneficiario se han cargado correctamente en el formulario.'
              ).subscribe();
            }
          } catch (error) {
            console.error('Error al cargar datos del beneficiario:', error);
            this.confirmationDialogService.showError(
              'Error al Cargar Datos',
              'No se pudieron cargar los datos del beneficiario. Por favor, intenta nuevamente.'
            ).subscribe();
          }
        } else {
          this.confirmationDialogService.showInfo(
            'Operación Cancelada',
            'La operación ha sido cancelada por el usuario.'
          ).subscribe();
        }
      });
    } else {
      // El beneficiario no existe - informar y permitir continuar con el registro
      this.confirmationDialogService.showInfo(
        'Nuevo Registro',
        'El beneficiario no existe en el sistema. Puede continuar con el registro.',
        'Continuar'
      ).subscribe();
    }
    this.isDisabled = response.data!;
    this.setLockedForm(this.isDisabled);
  }

  isStepCompleted(step: number): boolean {
    return step < this.currentStep;
  }

  async onSubmit(): Promise<void> {
    console.log(this.beneficiaryForm.value);
    if (this.beneficiaryForm.valid) {
      const dataToSend = {
        beneficiario: this.beneficiaryForm.value,
        servicios_basicos: this.selectedServiciosBasicos,
        apoderado: (this.mostrarApoderado) ? this.prepareApoderadoData() : null,
      };
      console.log(this.beneficiaryForm.value);
      
      console.log('✅ Datos para enviar al backend:', dataToSend);
      
      try {
        let response;
        
        // Determinar si es creación o actualización
        if (this.isEditMode && this.currentBeneficiaryId !== null) {
          // MODO ACTUALIZACIÓN
          response = await this.beneficiaryRegistrationService.putUpdateBeneficiary(
            this.currentBeneficiaryId,
            dataToSend
          );
          console.log('Respuesta del backend (actualización):', response);
          
          // Mostrar mensaje de éxito de actualización
          this.confirmationDialogService.showSuccess(
            '¡Actualización Exitosa!',
            'Los datos del beneficiario han sido actualizados correctamente en el sistema.',
            'Aceptar'
          ).subscribe(() => {
            this.resetForm();
          });
        } else {
          // MODO CREACIÓN
          response = await this.beneficiaryRegistrationService.postCreateBeneficiary(dataToSend);
          console.log('Respuesta del backend (creación):', response);
          
          // Mostrar mensaje de éxito de creación
          this.confirmationDialogService.showSuccess(
            '¡Registro Exitoso!',
            'El beneficiario ha sido registrado correctamente en el sistema.',
            'Aceptar'
          ).subscribe(() => {
            this.resetForm();
          });
        }
      } catch (error) {
        console.error('Error al guardar:', error);
        const mensaje = this.isEditMode 
          ? 'No se pudo actualizar el beneficiario. Por favor, verifica los datos e intenta nuevamente.'
          : 'No se pudo registrar el beneficiario. Por favor, verifica los datos e intenta nuevamente.';
        
        this.confirmationDialogService.showError(
          'Error al Guardar',
          mensaje,
          'Cerrar'
        ).subscribe();
      }
    } else {
      console.log('❌ Formulario inválido');
      this.markAllAsTouched();
      this.confirmationDialogService.showWarning(
        'Formulario Incompleto',
        'Por favor complete todos los campos requeridos antes de continuar.',
        'Entendido'
      ).subscribe();
    }
  }

  /**
   * Resetea el formulario a su estado inicial
   */
  private resetForm(): void {
    this.beneficiaryForm.reset({
      tipo_documento_codigo: '001',
      tiene_hijos: false,
      tiene_carnet_conadis: false,
      tiene_certificado_discapacidad: false,
      recibe_atencion_medica: false,
      toma_medicamentos: false,
      otras_personas_discapacidad: false,
      labora_actualmente: false,
      recibio_test_vocacional: false,
    });
    this.currentStep = 1;
    this.selectedServiciosBasicos = []; // Limpiar servicios básicos
    this.mostrarApoderado = false; // Ocultar sección de apoderado
    this.isDisabled = true; // Volver a deshabilitar el formulario
    this.isEditMode = false; // Desactivar modo edición
    this.currentBeneficiaryId = null; // Limpiar ID del beneficiario
    this.setLockedForm(true); // Bloquear formulario
  }

  prepareApoderadoData(): any {
    const form = this.beneficiaryForm.value;
    if (form.apoderado_nombres) {
      return {
        nombres: form.apoderado_nombres,
        id_parentesco: form.apoderado_id_parentesco,
        tipo_documento_codigo: form.apoderado_tipo_documento,
        numero_documento: form.apoderado_numero_documento,
        telefono: form.apoderado_telefono,
        direccion: form.apoderado_direccion,
      };
    }
    return null;
  }

  onServicioBasicoChange(event: any, idServicio: number): void {
    if (event.target.checked) {
      // Evitar duplicados
      if (!this.selectedServiciosBasicos.includes(idServicio)) {
        this.selectedServiciosBasicos.push(idServicio);
      }
    } else {
      const index = this.selectedServiciosBasicos.indexOf(idServicio);
      if (index > -1) {
        this.selectedServiciosBasicos.splice(index, 1);
      }
    }
    console.log('Servicios básicos seleccionados:', this.selectedServiciosBasicos);
  }

  /**
   * Verifica si un servicio básico está seleccionado
   * @param idServicio ID del servicio a verificar
   * @returns true si el servicio está seleccionado
   */
  isServicioBasicoSelected(idServicio: number): boolean {
    return this.selectedServiciosBasicos.includes(idServicio);
  }

  onCancel(): void {
    const mensaje = this.isEditMode 
      ? 'Tienes cambios sin guardar. Si cancelas, se perderán todas las modificaciones. ¿Estás seguro?'
      : 'Tienes cambios sin guardar. Si cancelas, se perderán todos los datos ingresados. ¿Estás seguro?';

    this.confirmationDialogService.showConfirm(
      '¿Cancelar Operación?',
      mensaje,
      'Sí, cancelar',
      'No, continuar'
    ).subscribe(confirmar => {
      if (confirmar) {
        this.resetForm();
        this.confirmationDialogService.showInfo(
          'Operación Cancelada',
          'El formulario ha sido limpiado correctamente.'
        ).subscribe();
      }
    });
  }

  private loadBeneficiaryData(data: BeneficiaryResponse): void {
    // Establecer modo edición
    this.isEditMode = true;
    this.currentBeneficiaryId = data.idBeneficiario;

    // Convertir la fecha del formato ISO al formato YYYY-MM-DD para el input date
    const fechaNacimiento = data.fechaNacimiento ? data.fechaNacimiento.split('T')[0] : '';

    this.beneficiaryForm.patchValue({
      // Paso 1: Identidad y Datos Básicos
      nombres_completos: data.nombresCompletos || '',
      edad_texto: data.edad || 0,
      tipo_documento_codigo: data.tipoDocumentoCodigo || '001',
      numero_documento: data.numeroDocumento || '',
      id_nacionalidad: data.idNacionalidad || '',
      nacionalidad_otro: data.nacionalidadOtro || '',
      sexo: data.sexo || '',
      fecha_nacimiento: fechaNacimiento,
      telefono: data.telefono || '',
      correo_electronico: data.correoElectronico || '',

      // Paso 2: Ubigeo y Domicilio
      id_departamento: data.idDepartamento || '',
      id_provincia: data.idProvincia || '',
      id_distrito: data.idDistrito || '',
      id_estado_civil: data.idEstadoCivil || '',
      tiene_hijos: data.tieneHijos || false,
      numero_hijos: data.numeroHijos,
      direccion_actual: data.direccionActual || '',
      referencia: data.referencia || '',

      // Paso 3: Discapacidad
      tiene_carnet_conadis: data.tieneCarnetConadis || false,
      numero_carnet_conadis: data.numeroCarnetConadis || '',
      tiene_certificado_discapacidad: data.tieneCertificadoDiscapacidad || false,
      id_grado_discapacidad: data.idGradoDiscapacidad,
      id_tipo_discapacidad: data.idTipoDiscapacidad,
      discapacidad_otro: data.discapacidadOtro || '',
      cie10: data.cie10 || '',
      id_causa_discapacidad: data.idCausaDiscapacidad,
      id_ayuda_biomecanica: data.idAyudaBiomecanica,

      // Paso 4: Salud
      recibe_atencion_medica: data.recibeAtencionMedica || false,
      toma_medicamentos: data.tomaMedicamentos || false,
      tratamiento: data.tratamiento || '',
      otras_personas_discapacidad: data.otrasPersonasDiscapacidad || false,
      cuantas_personas_discapacidad: data.cuantasPersonasDiscapacidad,
      id_seguro: data.idSeguro,

      // Paso 5: Educación y Empleo
      labora_actualmente: data.laboraActualmente || false,
      lugar_trabajo: data.lugarTrabajo || '',
      funcion_desempena: data.funcionDesempena || '',
      id_grado_instruccion: data.idGradoInstruccion,
      centro_estudios: data.centroEstudios || '',
      carrera: data.carrera || '',
      idiomas: data.idiomas || '',
      id_tipo_apoyo: data.idTipoApoyo,
      id_actividad_deportiva: data.idActividadDeportiva,
      recibio_test_vocacional: data.recibioTestVocacional || false,
      test_vocacional_donde: data.testVocacionalDonde || '',

      // Paso 6: Vivienda y Programas Sociales
      id_condicion_vivienda: data.idCondicionVivienda,
      id_tipo_vivienda: data.idTipoVivienda,
      id_con_quien_vive: data.idConQuienVive,
      id_programa_social: data.idProgramaSocial,

      // Paso 7: Apoderado
      apoderado_nombres: data.nombresApoderado || '',
      apoderado_id_parentesco: data.idParentescoApoderado || null,
      apoderado_tipo_documento: data.tipoDocumentoCodigoApoderado || '001',
      apoderado_numero_documento: data.numeroDocumentoApoderado || '',
      apoderado_telefono: data.telefonoApoderado || '',
      apoderado_direccion: data.direccionApoderado || ''
    });

    // Cargar servicios básicos seleccionados
    if (data.serviciosBasicos && Array.isArray(data.serviciosBasicos)) {
      this.selectedServiciosBasicos = [...data.serviciosBasicos];
      console.log('✅ Servicios básicos cargados:', this.selectedServiciosBasicos);
    }

    // Habilitar el formulario para permitir la edición
    this.isDisabled = false;
    this.setLockedForm(false);

    this.mostrarApoderado = data.idParentescoApoderado ? true : false;
    
    console.log('✅ Datos del beneficiario cargados en el formulario');
  }

  private markAllAsTouched(): void {
    Object.keys(this.beneficiaryForm.controls).forEach((key) => {
      const control = this.beneficiaryForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getters para validaciones
  get nombres_completos() {
    return this.beneficiaryForm.get('nombres_completos');
  }
  get numero_documento() {
    return this.beneficiaryForm.get('numero_documento');
  }
  get fecha_nacimiento() {
    return this.beneficiaryForm.get('fecha_nacimiento');
  }
  get sexo() {
    return this.beneficiaryForm.get('sexo');
  }
  get telefono() {
    return this.beneficiaryForm.get('telefono');
  }
  get correo_electronico() {
    return this.beneficiaryForm.get('correo_electronico');
  }
  get id_departamento() {
    return this.beneficiaryForm.get('id_departamento');
  }
  get id_provincia() {
    return this.beneficiaryForm.get('id_provincia');
  }
  get id_distrito() {
    return this.beneficiaryForm.get('id_distrito');
  }
  get nombres_registrador() {
    return this.beneficiaryForm.get('nombres_registrador');
  }
}
