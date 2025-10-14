
Feature: Modulo de urgencias
Como enfermera Quiero poder registrar las admisiones de los pacientes a urgenciasPara determinar que pacientes tienen mayor prioridad de atención

  Background:
    Given los pacientes registrados con los siguientes datos:
      | cuil          | nombre | apellido | calle      | numero | localidad              |
      | 20-12345678-1 | Juan   | Pérez    | Las Heras  | 955    | San Miguel de Tucumán  |
      | 20-87654321-1 | María  | López    | Monteagudo | 650    | San Miguel de Tucumán  |
      | 20-22222222-1 | Carlos | Ruiz     | 25 de Mayo | 320    | San Miguel de Tucumán  |
    And existe una enfermera registrada con los siguientes datos:
      | cuil          | nombre    | apellido    |  matricula |
      | 20-44444444-1 | Martina   | Stoessel    |  34        |
      

##-----------------------------------------------------------------------------------------------------------------------------------------##
##-----------------------------------------------------------------------------------------------------------------------------------------##
##                                                         ESCENARIOS                                                                      ##
##-----------------------------------------------------------------------------------------------------------------------------------------##
##-----------------------------------------------------------------------------------------------------------------------------------------##

  Scenario: Ingreso de urgencias de paciente existente
    Given el sistema tiene la siguiente cola de pacientes en espera:
      | cuil          | nombre      | nivelEmergencia | estado    | horaIngreso |
      | 20-87654321-1 | María López | Urgencia        | Pendiente |       10:30 |
      | 20-22222222-1 | Carlos Ruiz | Sin Urgencia    | Pendiente |       10:20 |
    When el paciente ingresa a urgencias con los siguientes datos:
      | cuil      | informe         | nivelEmergencia | temperatura | frecuenciaCardiaca | frecuenciaRespiratoria | tensionArterial |
      | 20-12345678-1 | Dolor abdominal | Sin Urgencia    |        36.6 |                 72 |                     16 |          120/80 |
    Then se registra el ingreso del paciente a la cola con estado: Pendiente y hora actual "10:45"
    And la cola de espera de pacientes es:
      | nombre      |
      | María López |
      | Carlos Ruiz |
      | Juan Pérez  |

##-----------------------------------------------------------------------------------------------------------------------------------------##
##-----------------------------------------------------------------------------------------------------------------------------------------##

  Scenario: Ingreso de urgencias de paciente no existente
    When un paciente ingresa a urgencias con los siguientes datos:
      | cuil          | nombre | apellido |
      | 20-11111111-1 | Ivan   | Ochoa    |
    Then se registra el nuevo paciente

##-----------------------------------------------------------------------------------------------------------------------------------------##
##-----------------------------------------------------------------------------------------------------------------------------------------##

  Scenario: Ingreso a urgencias de paciente existente con datos incompletos
    When el paciente ingresa a urgencias con los siguientes datos:
      | cuil      | informe         | nivelEmergencia | temperatura | frecuenciaCardiaca | frecuenciaRespiratoria | tensionArterial |
      | 20-12345678-1 | Dolor abdominal | Sin Urgencia    |             |                 72 |                     16 |          120/80 |
    Then debo ver un mensaje de error "ERROR: Hay campos sin completar"

##-----------------------------------------------------------------------------------------------------------------------------------------##
##-----------------------------------------------------------------------------------------------------------------------------------------##

  Scenario: Ingreso de paciente cargando frecuencia cardíaca con valor negativo
    When el paciente ingresa a urgencias con los siguientes datos:
      | cuil      | informe         | nivelEmergencia | temperatura | frecuenciaCardiaca | frecuenciaRespiratoria | tensionArterial |
      | 20-12345678-1 | Dolor abdominal | Sin Urgencia    |        36.6 |                -72 |                     16 |          120/80 |
    Then debo ver un mensaje de error "ERROR: El valor de la frecuencia cardíaca no puede ser negativo"

##-----------------------------------------------------------------------------------------------------------------------------------------##
##-----------------------------------------------------------------------------------------------------------------------------------------##


  Scenario: Ingreso de paciente cargando frecuencia respiratoria con valor negativo
    When el paciente ingresa a urgencias con los siguientes datos:
      | cuil      | informe         | nivelEmergencia | temperatura | frecuenciaCardiaca | frecuenciaRespiratoria | tensionArterial |
      | 20-12345678-1 | Dolor abdominal | Sin Urgencia    |        36.6 |                 72 |                    -16 |          120/80 |
    Then debo ver un mensaje de error "ERROR: El valor de la frecuencia respiratoria no puede ser negativo"

##-----------------------------------------------------------------------------------------------------------------------------------------##
##-----------------------------------------------------------------------------------------------------------------------------------------##

  Scenario: Ingreso de paciente con mayor nivel de emergencia
    Given el sistema tiene la siguiente cola de pacientes en espera:
      | cuil      | nombre      | nivelEmergencia | estado    | horaIngreso |
      | 20-87654321-1 | María López | Urgencia        | Pendiente |       10:30 |
    When el paciente ingresa a urgencias con los siguientes datos:
      | cuil      | informe         | nivelEmergencia | temperatura | frecuenciaCardiaca | frecuenciaRespiratoria | tensionArterial |
      | 20-12345678-1 | Dolor abdominal | Emergencia      |        36.6 |                 72 |                     16 |          120/80 |
    Then se registra el ingreso del paciente a la cola con estado: Pendiente y hora actual "10:45"
    And la cola de espera de pacientes es:
      | nombre      |
      | Juan Pérez  |
      | María López |

##-----------------------------------------------------------------------------------------------------------------------------------------##
##-----------------------------------------------------------------------------------------------------------------------------------------##

  Scenario: Ingreso de paciente con menor nivel de emergencia
    Given el sistema tiene la siguiente cola de pacientes en espera:
      | cuil      | nombre      | nivelEmergencia | estado    | horaIngreso |
      | 20-87654321-1 | María López | Urgencia        | Pendiente |       10:30 |
    When el paciente ingresa a urgencias con los siguientes datos:
      | cuil      | informe         | nivelEmergencia | temperatura | frecuenciaCardiaca | frecuenciaRespiratoria | tensionArterial |
      | 20-12345678-1 | Dolor abdominal | Urgencia Menor  |        36.6 |                 72 |                     16 |          120/80 |
    Then se registra el ingreso del paciente a la cola con estado: Pendiente y hora actual "10:45"
    And la cola de espera de pacientes es:
      | nombre      |
      | María López |
      | Juan Pérez  |

##-----------------------------------------------------------------------------------------------------------------------------------------##
##-----------------------------------------------------------------------------------------------------------------------------------------##

  Scenario: Ingreso de paciente con igual nivel de emergencia
    Given el sistema tiene la siguiente cola de pacientes en espera:
      | cuil      | nombre      | nivelEmergencia | estado    | horaIngreso |
      | 20-87654321-1 | María López | Urgencia        | Pendiente |       10:30 |
      | 20-22222222-1 | Carlos Ruiz | Sin Urgencia    | Pendiente |       10:20 |
    When el paciente ingresa a urgencias con los siguientes datos:
      | cuil      | informe         | nivelEmergencia | temperatura | frecuenciaCardiaca | frecuenciaRespiratoria | tensionArterial |
      | 20-12345678-1 | Dolor abdominal | Urgencia        |        36.6 |                 72 |                     16 |          120/80 |
    Then se registra el ingreso del paciente a la cola con estado: Pendiente y hora actual "10:45"
    And la cola de espera de pacientes es:
      | nombre      |
      | María López |
      | Juan Pérez  |
      | Carlos Ruiz |

##-----------------------------------------------------------------------------------------------------------------------------------------##
##-----------------------------------------------------------------------------------------------------------------------------------------##      
