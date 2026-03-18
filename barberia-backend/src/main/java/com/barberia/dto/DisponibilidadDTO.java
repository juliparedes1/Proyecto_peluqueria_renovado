package com.barberia.dto;

import lombok.Data;

@Data
public class DisponibilidadDTO {
    private Long id;
    private Integer diaSemana;
    private String nombreDia;
    private Boolean estaAbierto;
    private String horaInicio;
    private String horaFin;
}
