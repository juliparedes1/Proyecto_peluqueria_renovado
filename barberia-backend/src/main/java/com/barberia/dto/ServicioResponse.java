package com.barberia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServicioResponse {
    private Long id;
    private String nombre;
    private Integer precio;
    private Integer duracionMinutos;
    private Boolean estaActivo;
}