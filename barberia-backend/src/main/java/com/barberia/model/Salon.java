package com.barberia.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "salons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Salon {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "nombre", nullable = false)
    private String nombre;
    
    @Column(name = "email", nullable = false, unique = true)
    private String email;
    
    @Column(name = "telefono", nullable = false)
    private String telefono;
    
    @Column(name = "ubicacion", nullable = false)
    private String ubicacion;
    
    @Column(name = "esta_activo", nullable = false)
    private Boolean estaActivo = true;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
    
    @Column(name = "fecha_eliminacion")
    private LocalDateTime fechaEliminacion;
    
    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
    }
    
    public Salon(String nombre, String email, String telefono, String ubicacion) {
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
        this.ubicacion = ubicacion;
        this.estaActivo = true;
    }
}