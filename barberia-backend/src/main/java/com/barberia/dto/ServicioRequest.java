package com.barberia.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ServicioRequest {
    
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;
    
    @NotNull(message = "El precio es obligatorio")
    private Integer precio;
    
    @NotNull(message = "La duración es obligatoria")
    private Integer duracionMinutos;
}