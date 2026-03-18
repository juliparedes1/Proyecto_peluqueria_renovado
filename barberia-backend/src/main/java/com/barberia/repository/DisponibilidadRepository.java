package com.barberia.repository;

import com.barberia.model.Disponibilidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DisponibilidadRepository extends JpaRepository<Disponibilidad, Long> {
    
    List<Disponibilidad> findAll();
    
    Optional<Disponibilidad> findByDiaSemana(Integer diaSemana);
}
