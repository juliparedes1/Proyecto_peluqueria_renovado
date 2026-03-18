package com.barberia.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "disponibilidad")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Disponibilidad {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "dia_semana", nullable = false)
    private Integer diaSemana; // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    
    @Column(name = "esta_abierto", nullable = false)
    private Boolean estaAbierto;
    
    @Column(name = "hora_inicio")
    private String horaInicio; // Formato "HH:mm"
    
    @Column(name = "hora_fin")
    private String horaFin; // Formato "HH:mm"
    
    public Disponibilidad(Integer diaSemana, Boolean estaAbierto, String horaInicio, String horaFin) {
        this.diaSemana = diaSemana;
        this.estaAbierto = estaAbierto;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
    }
}
