
export interface BeneficiaryResponse {
  idBeneficiario: number;
  nombresCompletos: string;
  edad: number;
  tipoDocumentoCodigo: string;
  numeroDocumento: string;
  idNacionalidad: number;
  nacionalidadOtro: string;
  sexo: string;
  fechaNacimiento: string;
  telefono: string;
  correoElectronico: string;
  idDepartamento: number;
  idProvincia: number;
  idDistrito: number;
  idEstadoCivil: number;
  tieneHijos: boolean;
  numeroHijos: number | null;
  direccionActual: string;
  referencia: string;
  tieneCarnetConadis: boolean;
  numeroCarnetConadis: string;
  tieneCertificadoDiscapacidad: boolean;
  idGradoDiscapacidad: number;
  idGradoDependencia: number;
  idTipoDiscapacidad: number;
  discapacidadOtro: string;
  cie10: string;
  idCausaDiscapacidad: number;
  recibeAtencionMedica: boolean;
  tomaMedicamentos: boolean;
  tratamiento: string;
  otrasPersonasDiscapacidad: boolean;
  cuantasPersonasDiscapacidad: number | null;
  idAyudaBiomecanica: number;
  recibioTestVocacional: boolean;
  testVocacionalDonde: string;
  laboraActualmente: boolean;
  lugarTrabajo: string;
  idRangoSalarial: number;
  funcionDesempena: string;
  idGradoInstruccion: number;
  centroEstudios: string;
  carrera: string;
  idiomas: string;
  idTipoApoyo: number;
  idActividadDeportiva: number;
  idCondicionVivienda: number;
  idTipoVivienda: number;
  idConQuienVive: number;
  idSeguro: number;
  idProgramaSocial: number;

  //Apoderado
  idApoderado: number;
  nombresApoderado: string;
  idParentescoApoderado: number;
  tipoDocumentoCodigoApoderado: string;
  numeroDocumentoApoderado: string;
  telefonoApoderado: string;
  direccionApoderado: string;

  //Servicios Basicos
  serviciosBasicos: number[];
}
