package com.barberia.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TurnoRequest {
    
    @NotBlank(message = "El servicio es obligatorio")
    private String servicio;
    
    @NotNull(message = "El precio es obligatorio")
    private Integer precio;
    
    @NotBlank(message = "La fecha es obligatoria")
    private String fecha; // Formato "YYYY-MM-DD"
    
    @NotBlank(message = "La hora es obligatoria")
    private String hora;
    
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;
    
    @NotBlank(message = "El teléfono es obligatorio")
    private String telefono;
    
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe ser válido")
    private String email;
}
