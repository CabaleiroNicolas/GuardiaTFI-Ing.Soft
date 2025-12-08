export interface AtencionDto {
    id: number,
    informe: string,
    medico_nombre: string,
    medico_apellido: string,
    enfermera_nombre: string,
    enfermera_apellido: string,
    paciente_nombre: string,
    paciente_apellido: string,
    paciente_cuil: string,
    fecha_atencion: Date,
}