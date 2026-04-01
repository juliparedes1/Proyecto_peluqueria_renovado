package com.barberia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalonResponse {
    private Long id;
    private String nombre;
    private String email;
    private String telefono;
    private String ubicacion;
    private Boolean estaActivo;
    private LocalDateTime fechaCreacion;
    private String emailAdmin;
}