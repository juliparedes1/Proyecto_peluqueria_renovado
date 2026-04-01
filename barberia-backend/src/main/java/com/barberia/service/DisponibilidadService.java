package com.barberia.service;

import com.barberia.model.Disponibilidad;
import com.barberia.model.Salon;
import com.barberia.repository.DisponibilidadRepository;
import com.barberia.repository.SalonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DisponibilidadService {
    
    private static final String[] NOMBRE_DIAS = {
        "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
    };
    
    @Autowired
    private DisponibilidadRepository disponibilidadRepository;
    
    @Autowired
    private SalonRepository salonRepository;
    
    public void inicializarDisponibilidad(Long salonId) {
        if (disponibilidadRepository.findBySalonId(salonId).isEmpty()) {
            Salon salon = salonRepository.findById(salonId)
                .orElseThrow(() -> new RuntimeException("Salón no encontrado"));
            
            disponibilidadRepository.save(new Disponibilidad(salon, 0, false, null, null));
            disponibilidadRepository.save(new Disponibilidad(salon, 1, true, "09:00", "18:00"));
            disponibilidadRepository.save(new Disponibilidad(salon, 2, true, "09:00", "18:00"));
            disponibilidadRepository.save(new Disponibilidad(salon, 3, true, "09:00", "18:00"));
            disponibilidadRepository.save(new Disponibilidad(salon, 4, true, "09:00", "18:00"));
            disponibilidadRepository.save(new Disponibilidad(salon, 5, true, "09:00", "18:00"));
            disponibilidadRepository.save(new Disponibilidad(salon, 6, true, "09:00", "18:00"));
        }
    }
    
    public List<Disponibilidad> getAllDisponibilidad(Long salonId) {
        return disponibilidadRepository.findBySalonId(salonId);
    }
    
    public boolean isDiaAbierto(Long salonId, Integer diaSemana) {
        return disponibilidadRepository.findBySalonIdAndDiaSemana(salonId, diaSemana)
            .map(Disponibilidad::getEstaAbierto)
            .orElse(false);
    }
    
    public Disponibilidad getDisponibilidadPorDia(Long salonId, Integer diaSemana) {
        return disponibilidadRepository.findBySalonIdAndDiaSemana(salonId, diaSemana).orElse(null);
    }
    
    public Disponibilidad guardarDisponibilidad(Disponibilidad disponibilidad) {
        return disponibilidadRepository.save(disponibilidad);
    }
    
    public List<Integer> getDiasAbiertos(Long salonId) {
        return disponibilidadRepository.findBySalonId(salonId).stream()
            .filter(Disponibilidad::getEstaAbierto)
            .map(Disponibilidad::getDiaSemana)
            .collect(Collectors.toList());
    }
    
    public String getNombreDia(Integer diaSemana) {
        if (diaSemana >= 0 && diaSemana < NOMBRE_DIAS.length) {
            return NOMBRE_DIAS[diaSemana];
        }
        return "";
    }
}