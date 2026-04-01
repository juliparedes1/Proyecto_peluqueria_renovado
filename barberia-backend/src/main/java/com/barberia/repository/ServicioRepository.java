package com.barberia.repository;

import com.barberia.model.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServicioRepository extends JpaRepository<Servicio, Long> {
    List<Servicio> findBySalonIdAndEstaActivoTrue(Long salonId);
    List<Servicio> findBySalonId(Long salonId);
}