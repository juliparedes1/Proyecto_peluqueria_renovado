package com.barberia.service;

import com.barberia.model.Disponibilidad;
import com.barberia.repository.DisponibilidadRepository;
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
    
    public void inicializarDisponibilidad() {
        if (disponibilidadRepository.count() == 0) {
            // Por defecto: Lunes a sábado abiertos, domingo cerrado
            disponibilidadRepository.save(new Disponibilidad(0, false, null, null)); // Domingo
            disponibilidadRepository.save(new Disponibilidad(1, true, "09:00", "18:00")); // Lunes
            disponibilidadRepository.save(new Disponibilidad(2, true, "09:00", "18:00")); // Martes
            disponibilidadRepository.save(new Disponibilidad(3, true, "09:00", "18:00")); // Miércoles
            disponibilidadRepository.save(new Disponibilidad(4, true, "09:00", "18:00")); // Jueves
            disponibilidadRepository.save(new Disponibilidad(5, true, "09:00", "18:00")); // Viernes
            disponibilidadRepository.save(new Disponibilidad(6, true, "09:00", "18:00")); // Sábado
        }
    }
    
    public List<Disponibilidad> getAllDisponibilidad() {
        return disponibilidadRepository.findAll();
    }
    
    public boolean isDiaAbierto(Integer diaSemana) {
        return disponibilidadRepository.findByDiaSemana(diaSemana)
                .map(Disponibilidad::getEstaAbierto)
                .orElse(false);
    }
    
    public Disponibilidad getDisponibilidadPorDia(Integer diaSemana) {
        return disponibilidadRepository.findByDiaSemana(diaSemana).orElse(null);
    }
    
    public Disponibilidad guardarDisponibilidad(Disponibilidad disponibilidad) {
        return disponibilidadRepository.save(disponibilidad);
    }
    
    public List<Integer> getDiasAbiertos() {
        return disponibilidadRepository.findAll().stream()
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
