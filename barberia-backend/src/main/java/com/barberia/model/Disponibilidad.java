package com.barberia.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "disponibilidad")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Disponibilidad {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "salon_id", nullable = false)
    private Salon salon;
    
    @Column(name = "dia_semana", nullable = false)
    private Integer diaSemana;
    
    @Column(name = "esta_abierto", nullable = false)
    private Boolean estaAbierto;
    
    @Column(name = "hora_inicio")
    private String horaInicio;
    
    @Column(name = "hora_fin")
    private String horaFin;
    
    public Disponibilidad(Salon salon, Integer diaSemana, Boolean estaAbierto, String horaInicio, String horaFin) {
        this.salon = salon;
        this.diaSemana = diaSemana;
        this.estaAbierto = estaAbierto;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
    }
}