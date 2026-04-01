package com.barberia.repository;

import com.barberia.model.Disponibilidad;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DisponibilidadRepository extends JpaRepository<Disponibilidad, Long> {
    List<Disponibilidad> findBySalonId(Long salonId);
    Optional<Disponibilidad> findBySalonIdAndDiaSemana(Long salonId, Integer diaSemana);
}