import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

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

  // Catálogos según BD - Estos vendrán del backend
  tiposDocumento = [
    { codigo: 'DNI', nombre: 'DNI' },
    { codigo: 'CE', nombre: 'Carnet de Extranjería' },
    { codigo: 'PASAPORTE', nombre: 'Pasaporte' },
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

  provincias: any[] = [];
  distritos: any[] = [];

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

  selectedServiciosBasicos: number[] = [];
  mostrarApoderado: boolean = false; // Control para mostrar/ocultar sección apoderado

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.beneficiaryForm = this.fb.group({
      // 🟦 PASO 1: IDENTIDAD Y DATOS BÁSICOS
      nombres_completos: ['', [Validators.required, Validators.minLength(3)]],
      edad_texto: [''],
      tipo_documento_codigo: ['DNI', Validators.required],
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
      apoderado_tipo_documento: ['DNI'],
      apoderado_numero_documento: [''],
      apoderado_telefono: [''],
      apoderado_direccion: [''],

      // Datos institucionales (Paso 6)
      esta_registrado_omaped: [true],
      nombres_registrador: ['', Validators.required],
    });

    this.setupConditionalValidators();
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

  isStepCompleted(step: number): boolean {
    return step < this.currentStep;
  }

  onSubmit(): void {
    if (this.beneficiaryForm.valid) {
      const dataToSend = {
        beneficiario: this.beneficiaryForm.value,
        servicios_basicos: this.selectedServiciosBasicos,
        apoderado: this.prepareApoderadoData(),
      };
      console.log('✅ Datos para enviar al backend:', dataToSend);
      alert('Formulario enviado correctamente. Revisa la consola.');
      // Aquí irá la llamada al servicio
      // this.beneficiaryService.create(dataToSend).subscribe(...)
    } else {
      console.log('❌ Formulario inválido');
      this.markAllAsTouched();
      alert('Por favor complete todos los campos requeridos');
    }
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
      this.selectedServiciosBasicos.push(idServicio);
    } else {
      const index = this.selectedServiciosBasicos.indexOf(idServicio);
      if (index > -1) {
        this.selectedServiciosBasicos.splice(index, 1);
      }
    }
  }

  onCancel(): void {
    if (
      confirm(
        '¿Está seguro de cancelar? Se perderán todos los datos ingresados.'
      )
    ) {
      this.beneficiaryForm.reset({
        tipo_documento_codigo: 'DNI',
        tiene_hijos: false,
        tiene_carnet_conadis: false,
        tiene_certificado_discapacidad: false,
        recibe_atencion_medica: false,
        toma_medicamentos: false,
        otras_personas_discapacidad: false,
        labora_actualmente: false,
        recibio_test_vocacional: false,
        esta_registrado_omaped: true,
      });
      this.currentStep = 1;
    }
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
