
Feature: Modulo de urgencias
Como enfermera Quiero poder registrar las admisiones de los pacientes a urgenciasPara determinar que pacientes tienen mayor prioridad de atención

  Background:
    Given los pacientes registrados con los siguientes datos:
      | dni      | nombre      |
      | 12345678 | Juan Pérez  |
      | 87654321 | María López |
      | 22222222 | Carlos Ruiz |

##-----------------------------------------------------------------------------------------------------------------------------------------##
##-----------------------------------------------------------------------------------------------------------------------------------------##
##                                                         ESCENARIOS                                                                      ##
##-----------------------------------------------------------------------------------------------------------------------------------------##
##-----------------------------------------------------------------------------------------------------------------------------------------##

  Scenario: Ingreso de urgencias de paciente existente
    Given el sistema tiene la siguiente cola de pacientes en espera:
      | dni      | nombre      | nivelEmergencia | estado    | horaIngreso |
      | 87654321 | María López | Urgencia        | Pendiente |       10:30 |
      | 22222222 | Carlos Ruiz | Sin Urgencia    | Pendiente |       10:20 |
    When el paciente ingresa a urgencias con los siguientes datos:
      | dni      | informe         | nivelEmergencia | temperatura | frecuenciaCardiaca | frecuenciaRespiratoria | tensionArterial |
      | 12345678 | Dolor abdominal | Sin Urgencia    |        36.6 |                 72 |                     16 |          120/80 |
    Then se registra el ingreso del paciente a la cola con estado: Pendiente y hora actual "10:45"
    And la cola de espera de pacientes es:
      | dni      | nombre      | nivelEmergencia | estado    | horaIngreso |
      | 87654321 | María López | Urgencia        | Pendiente |       10:30 |
      | 22222222 | Carlos Ruiz | Sin Urgencia    | Pendiente |       10:20 |
      | 12345678 | Juan Pérez  | Sin Urgencia    | Pendiente |       10:45 |

##-----------------------------------------------------------------------------------------------------------------------------------------##
##-----------------------------------------------------------------------------------------------------------------------------------------##

  Scenario: Ingreso de urgencias de paciente no existente
    When un paciente ingresa a urgencias con los siguientes datos:
      | dni      | nombre     |
      | 11111111 | Ivan Ochoa |
    Then se registra el nuevo paciente

##-----------------------------------------------------------------------------------------------------------------------------------------##
##-----------------------------------------------------------------------------------------------------------------------------------------##

  Scenario: Ingreso a urgencias de paciente existente con datos incompletos
    When el paciente ingresa a urgencias con los siguientes datos:
      | dni      | informe         | nivelEmergencia | temperatura | frecuenciaCardiaca | frecuenciaRespiratoria | tensionArterial |
      | 12345678 | Dolor abdominal | Sin Urgencia    |             |                 72 |                     16 |          120/80 |
    Then debo ver un mensaje de error "ERROR: Hay campos sin completar"

##-----------------------------------------------------------------------------------------------------------------------------------------##
##-----------------------------------------------------------------------------------------------------------------------------------------##

  Scenario: Ingreso de paciente cargando frecuencia cardíaca con valor negativo
    When el paciente ingresa a urgencias con los siguientes datos:
      | dni      | informe         | nivelEmergencia | temperatura | frecuenciaCardiaca | frecuenciaRespiratoria | tensionArterial |
      | 12345678 | Dolor abdominal | Sin Urgencia    |        36.6 |                -72 |                     16 |          120/80 |
    Then debo ver un mensaje de error "ERROR: El valor de la frecuencia cardíaca no puede ser negativo"

##-----------------------------------------------------------------------------------------------------------------------------------------##
##-----------------------------------------------------------------------------------------------------------------------------------------##


  Scenario: Ingreso de paciente cargando frecuencia respiratoria con valor negativo
    When el paciente ingresa a urgencias con los siguientes datos:
      | dni      | informe         | nivelEmergencia | temperatura | frecuenciaCardiaca | frecuenciaRespiratoria | tensionArterial |
      | 12345678 | Dolor abdominal | Sin Urgencia    |        36.6 |                 72 |                    -16 |          120/80 |
    Then debo ver un mensaje de error "ERROR: El valor de la frecuencia respiratoria no puede ser negativo"

##-----------------------------------------------------------------------------------------------------------------------------------------##
##-----------------------------------------------------------------------------------------------------------------------------------------##

  Scenario: Ingreso de paciente con mayor nivel de emergencia
    Given el sistema tiene la siguiente cola de pacientes en espera:
      | dni      | nombre      | nivelEmergencia | estado    | horaIngreso |
      | 87654321 | María López | Urgencia        | Pendiente |       10:30 |
    When el paciente ingresa a urgencias con los siguientes datos:
      | dni      | informe         | nivelEmergencia | temperatura | frecuenciaCardiaca | frecuenciaRespiratoria | tensionArterial |
      | 12345678 | Dolor abdominal | Emergencia      |        36.6 |                 72 |                     16 |          120/80 |
    Then se registra el ingreso del paciente a la cola con estado: Pendiente y hora actual "10:45"
    And la cola de espera de pacientes es:
      | dni      | nombre      | nivelEmergencia | estado    | horaIngreso |
      | 12345678 | Juan Pérez  | Emergencia      | Pendiente |       10:45 |
      | 87654321 | María López | Urgencia        | Pendiente |       10:30 |

##-----------------------------------------------------------------------------------------------------------------------------------------##
##-----------------------------------------------------------------------------------------------------------------------------------------##

  Scenario: Ingreso de paciente con menor nivel de emergencia
    Given el sistema tiene la siguiente cola de pacientes en espera:
      | dni      | nombre      | nivelEmergencia | estado    | horaIngreso |
      | 87654321 | María López | Urgencia        | Pendiente |       10:30 |
    When el paciente ingresa a urgencias con los siguientes datos:
      | dni      | informe         | nivelEmergencia | temperatura | frecuenciaCardiaca | frecuenciaRespiratoria | tensionArterial |
      | 12345678 | Dolor abdominal | Urgencia Menor  |        36.6 |                 72 |                     16 |          120/80 |
    Then se registra el ingreso del paciente a la cola con estado: Pendiente y hora actual "10:45"
    And la cola de espera de pacientes es:
      | dni      | nombre      | nivelEmergencia | estado    | horaIngreso |
      | 87654321 | María López | Urgencia        | Pendiente |       10:30 |
      | 12345678 | Juan Pérez  | Urgencia Menor  | Pendiente |       10:45 |

##-----------------------------------------------------------------------------------------------------------------------------------------##
##-----------------------------------------------------------------------------------------------------------------------------------------##

  Scenario: Ingreso de paciente con igual nivel de emergencia
    Given el sistema tiene la siguiente cola de pacientes en espera:
      | dni      | nombre      | nivelEmergencia | estado    | horaIngreso |
      | 87654321 | María López | Urgencia        | Pendiente |       10:30 |
      | 22222222 | Carlos Ruiz | Sin Urgencia    | Pendiente |       10:20 |
    When el paciente ingresa a urgencias con los siguientes datos:
      | dni      | informe         | nivelEmergencia | temperatura | frecuenciaCardiaca | frecuenciaRespiratoria | tensionArterial |
      | 12345678 | Dolor abdominal | Urgencia        |        36.6 |                 72 |                     16 |          120/80 |
    Then se registra el ingreso del paciente a la cola con estado: Pendiente y hora actual "10:45"
    And la cola de espera de pacientes es:
      | dni      | nombre      | nivelEmergencia | estado    | horaIngreso |
      | 87654321 | María López | Urgencia        | Pendiente |       10:30 |
      | 12345678 | Juan Pérez  | Urgencia        | Pendiente |       10:45 |
      | 22222222 | Carlos Ruiz | Sin Urgencia    | Pendiente |       10:20 |

##-----------------------------------------------------------------------------------------------------------------------------------------##
##-----------------------------------------------------------------------------------------------------------------------------------------##      
