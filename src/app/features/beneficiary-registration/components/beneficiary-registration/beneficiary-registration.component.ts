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

  // Control de secciones expandidas
  expandedSections = {
    datosPersonales: true,
    domicilio: true,
    discapacidad: true,
    salud: false,
    educacionTrabajo: false,
    vivienda: false,
    apoderado: false,
  };

  // Catálogos - Datos Personales
  tiposDocumento = [
    { codigo: 'DNI', nombre: 'DNI' },
    { codigo: 'CE', nombre: 'Carnet de Extranjería' },
    { codigo: 'PASAPORTE', nombre: 'Pasaporte' },
    { codigo: 'OTRO', nombre: 'Otro' },
  ];

  nacionalidades = [
    { id: 1, nombre: 'Peruana' },
    { id: 2, nombre: 'Venezolana' },
    { id: 3, nombre: 'Colombiana' },
    { id: 4, nombre: 'Ecuatoriana' },
    { id: 5, nombre: 'Otra' },
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

  // Catálogos - Ubicación (estos deberían venir del backend)
  departamentos = [
    { id: 1, nombre: 'Lima' },
    { id: 2, nombre: 'Piura' },
    { id: 3, nombre: 'Arequipa' },
  ];

  provincias: any[] = [];
  distritos: any[] = [];

  // Catálogos - Discapacidad
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
    { id: 7, nombre: 'Otra' },
  ];

  // Catálogos - Educación y Trabajo
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
    { id: 6, nombre: 'Otra' },
  ];

  // Catálogos - Vivienda
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
    { id: 5, nombre: 'Otra' },
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
    { id: 6, descripcion: 'Otro' },
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

  // Catálogos - Apoderado
  tiposParentesco = [
    { id: 1, nombre: 'Padre' },
    { id: 2, nombre: 'Madre' },
    { id: 3, nombre: 'Hermano(a)' },
    { id: 4, nombre: 'Hijo(a)' },
    { id: 5, nombre: 'Cónyuge' },
    { id: 6, nombre: 'Tutor legal' },
    { id: 7, nombre: 'Otro' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.beneficiaryForm = this.fb.group({
      // 🟦 DATOS PERSONALES
      nombresCompletos: ['', [Validators.required, Validators.minLength(3)]],
      edadTexto: [''],
      tipoDocumentoCodigo: ['DNI', Validators.required],
      numeroDocumento: ['', [Validators.required, Validators.minLength(6)]],
      idNacionalidad: ['', Validators.required],
      nacionalidadOtro: [''],
      sexo: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],

      // 🟦 DOMICILIO Y UBICACIÓN
      idDepartamento: ['', Validators.required],
      idProvincia: ['', Validators.required],
      idDistrito: ['', Validators.required],
      idEstadoCivil: ['', Validators.required],
      tieneHijos: [false],
      numeroHijos: [0],
      direccionActual: [''],
      referencia: [''],
      telefono: ['', Validators.pattern(/^9[0-9]{8}$/)],

      // 🟦 DISCAPACIDAD
      tieneCarnetConadis: [false, Validators.required],
      numeroCarnetConadis: [''],
      tieneCertificadoDiscapacidad: [false, Validators.required],
      idGradoDiscapacidad: [''],
      idTipoDiscapacidad: [''],
      discapacidadOtro: [''],
      cie10: [''],
      idCausaDiscapacidad: [''],
      idAyudaBiomecanica: [''],

      // 🟦 SALUD
      recibeAtencionMedica: [false],
      tomaMedicamentos: [false],
      tratamiento: [''],
      otrasPersonasDiscapacidad: [false],
      cuantasPersonasDiscapacidad: [0],

      // 🟦 EDUCACIÓN Y TRABAJO
      laboraActualmente: [false],
      lugarTrabajo: [''],
      funcionDesempena: [''],
      idGradoInstruccion: [''],
      centroEstudios: [''],
      carrera: [''],
      idiomas: [''],
      recibioTestVocacional: [false],
      testVocacionalDonde: [''],
      idTipoApoyo: [''],
      idActividadDeportiva: [''],

      // 🟦 VIVIENDA Y CONVIVENCIA
      idCondicionVivienda: [''],
      idTipoVivienda: [''],
      serviciosBasicos: [[]],
      idConQuienVive: [''],
      idSeguro: [''],
      idProgramaSocial: [''],

      // 🟦 CONTACTO Y REGISTRO
      correoElectronico: ['', Validators.email],
      estaRegistradoOmaped: [true],
      nombresRegistrador: ['', Validators.required],

      // 🟦 APODERADO (opcional)
      apoderado: this.fb.group({
        nombres: [''],
        idParentesco: [''],
        tipoDocumentoCodigo: [''],
        numeroDocumento: [''],
        telefono: [''],
        direccion: [''],
      }),
    });

    // Listeners para campos condicionales
    this.setupConditionalFields();
  }

  setupConditionalFields(): void {
    // Si tiene hijos, número de hijos es requerido
    this.beneficiaryForm.get('tieneHijos')?.valueChanges.subscribe((value) => {
      const numeroHijosControl = this.beneficiaryForm.get('numeroHijos');
      if (value) {
        numeroHijosControl?.setValidators([
          Validators.required,
          Validators.min(1),
        ]);
      } else {
        numeroHijosControl?.clearValidators();
        numeroHijosControl?.setValue(0);
      }
      numeroHijosControl?.updateValueAndValidity();
    });

    // Si tiene carnet CONADIS, el número es requerido
    this.beneficiaryForm
      .get('tieneCarnetConadis')
      ?.valueChanges.subscribe((value) => {
        const numeroCarnetControl = this.beneficiaryForm.get(
          'numeroCarnetConadis'
        );
        if (value) {
          numeroCarnetControl?.setValidators(Validators.required);
        } else {
          numeroCarnetControl?.clearValidators();
        }
        numeroCarnetControl?.updateValueAndValidity();
      });

    // Si nacionalidad es "Otra", el campo otro es requerido
    this.beneficiaryForm
      .get('idNacionalidad')
      ?.valueChanges.subscribe((value) => {
        const otroControl = this.beneficiaryForm.get('nacionalidadOtro');
        if (value === 5) {
          // 5 = Otra
          otroControl?.setValidators(Validators.required);
        } else {
          otroControl?.clearValidators();
        }
        otroControl?.updateValueAndValidity();
      });
  }

  toggleSection(section: keyof typeof this.expandedSections): void {
    this.expandedSections[section] = !this.expandedSections[section];
  }

  onSubmit(): void {
    if (this.beneficiaryForm.valid) {
      const formData = this.prepareDataForBackend();
      console.log('Datos para enviar al backend:', formData);
      // Aquí llamarías al servicio: this.beneficiaryService.create(formData)
    } else {
      console.log('Formulario inválido');
      this.markFormGroupTouched(this.beneficiaryForm);
      this.expandInvalidSections();
    }
  }

  prepareDataForBackend(): any {
    const formValue = this.beneficiaryForm.value;

    // Estructura lista para enviar al backend (coincide con la BD)
    return {
      beneficiario: {
        nombres_completos: formValue.nombresCompletos,
        edad_texto: formValue.edadTexto,
        tipo_documento_codigo: formValue.tipoDocumentoCodigo,
        numero_documento: formValue.numeroDocumento,
        id_nacionalidad: formValue.idNacionalidad,
        nacionalidad_otro: formValue.nacionalidadOtro,
        sexo: formValue.sexo,
        fecha_nacimiento: formValue.fechaNacimiento,
        id_departamento: formValue.idDepartamento,
        id_provincia: formValue.idProvincia,
        id_distrito: formValue.idDistrito,
        id_estado_civil: formValue.idEstadoCivil,
        tiene_hijos: formValue.tieneHijos,
        numero_hijos: formValue.numeroHijos,
        direccion_actual: formValue.direccionActual,
        referencia: formValue.referencia,
        telefono: formValue.telefono,
        tiene_carnet_conadis: formValue.tieneCarnetConadis,
        numero_carnet_conadis: formValue.numeroCarnetConadis,
        tiene_certificado_discapacidad: formValue.tieneCertificadoDiscapacidad,
        id_grado_discapacidad: formValue.idGradoDiscapacidad,
        id_tipo_discapacidad: formValue.idTipoDiscapacidad,
        discapacidad_otro: formValue.discapacidadOtro,
        cie10: formValue.cie10,
        id_causa_discapacidad: formValue.idCausaDiscapacidad,
        recibe_atencion_medica: formValue.recibeAtencionMedica,
        toma_medicamentos: formValue.tomaMedicamentos,
        tratamiento: formValue.tratamiento,
        otras_personas_discapacidad: formValue.otrasPersonasDiscapacidad,
        cuantas_personas_discapacidad: formValue.cuantasPersonasDiscapacidad,
        id_ayuda_biomecanica: formValue.idAyudaBiomecanica,
        recibio_test_vocacional: formValue.recibioTestVocacional,
        test_vocacional_donde: formValue.testVocacionalDonde,
        labora_actualmente: formValue.laboraActualmente,
        lugar_trabajo: formValue.lugarTrabajo,
        funcion_desempena: formValue.funcionDesempena,
        id_grado_instruccion: formValue.idGradoInstruccion,
        centro_estudios: formValue.centroEstudios,
        carrera: formValue.carrera,
        idiomas: formValue.idiomas,
        id_tipo_apoyo: formValue.idTipoApoyo,
        id_actividad_deportiva: formValue.idActividadDeportiva,
        id_condicion_vivienda: formValue.idCondicionVivienda,
        id_tipo_vivienda: formValue.idTipoVivienda,
        id_con_quien_vive: formValue.idConQuienVive,
        id_seguro: formValue.idSeguro,
        id_programa_social: formValue.idProgramaSocial,
        correo_electronico: formValue.correoElectronico,
        esta_registrado_omaped: formValue.estaRegistradoOmaped,
        nombres_registrador: formValue.nombresRegistrador,
      },
      servicios_basicos: formValue.serviciosBasicos,
      apoderado: formValue.apoderado.nombres ? formValue.apoderado : null,
    };
  }

  expandInvalidSections(): void {
    // Expandir secciones con errores
    const controls = this.beneficiaryForm.controls;
    if (
      this.hasErrorsInSection([
        'nombresCompletos',
        'numeroDocumento',
        'sexo',
        'fechaNacimiento',
      ])
    ) {
      this.expandedSections.datosPersonales = true;
    }
    if (
      this.hasErrorsInSection(['idDepartamento', 'idProvincia', 'idDistrito'])
    ) {
      this.expandedSections.domicilio = true;
    }
  }

  hasErrorsInSection(fields: string[]): boolean {
    return fields.some((field) => {
      const control = this.beneficiaryForm.get(field);
      return control && control.invalid && control.touched;
    });
  }

  onCancel(): void {
    if (
      confirm(
        '¿Está seguro de cancelar? Se perderán todos los datos ingresados.'
      )
    ) {
      this.beneficiaryForm.reset();
      this.expandedSections.datosPersonales = true;
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Getters para validaciones
  get nombresCompletos() {
    return this.beneficiaryForm.get('nombresCompletos');
  }
  get numeroDocumento() {
    return this.beneficiaryForm.get('numeroDocumento');
  }
  get fechaNacimiento() {
    return this.beneficiaryForm.get('fechaNacimiento');
  }
  get sexo() {
    return this.beneficiaryForm.get('sexo');
  }
  get telefono() {
    return this.beneficiaryForm.get('telefono');
  }
  get correoElectronico() {
    return this.beneficiaryForm.get('correoElectronico');
  }
  get idDepartamento() {
    return this.beneficiaryForm.get('idDepartamento');
  }
  get idProvincia() {
    return this.beneficiaryForm.get('idProvincia');
  }
  get idDistrito() {
    return this.beneficiaryForm.get('idDistrito');
  }
  get nombresRegistrador() {
    return this.beneficiaryForm.get('nombresRegistrador');
  }
}
