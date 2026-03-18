package com.barberia.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "turnos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Turno {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "servicio", nullable = false)
    private String servicio;
    
    @Column(name = "precio", nullable = false)
    private Integer precio;
    
    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;
    
    @Column(name = "hora", nullable = false)
    private String hora; // Formato "HH:mm"
    
    @Column(name = "nombre", nullable = false)
    private String nombre;
    
    @Column(name = "telefono", nullable = false)
    private String telefono;
    
    @Column(name = "email", nullable = false)
    private String email;
    
    @Column(name = "estado", nullable = false)
    private String estado; // "CONFIRMADO", "CANCELADO"
    
    @Column(name = "token_cancelacion")
    private String tokenCancelacion;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (estado == null) {
            estado = "CONFIRMADO";
        }
        if (tokenCancelacion == null) {
            tokenCancelacion = java.util.UUID.randomUUID().toString();
        }
    }
    
    public Turno(String servicio, Integer precio, LocalDate fecha, String hora, 
                  String nombre, String telefono, String email) {
        this.servicio = servicio;
        this.precio = precio;
        this.fecha = fecha;
        this.hora = hora;
        this.nombre = nombre;
        this.telefono = telefono;
        this.email = email;
        this.estado = "CONFIRMADO";
        this.tokenCancelacion = java.util.UUID.randomUUID().toString();
    }
}
