package com.barberia.repository;

import com.barberia.model.Turno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TurnoRepository extends JpaRepository<Turno, Long> {
    
    List<Turno> findByFechaAndEstado(LocalDate fecha, String estado);
    
    @Query("SELECT t FROM Turno t WHERE t.fecha = :fecha AND t.hora = :hora AND t.estado = 'CONFIRMADO'")
    Optional<Turno> findByFechaAndHoraAndConfirmado(@Param("fecha") LocalDate fecha, @Param("hora") String hora);
    
    Optional<Turno> findByTokenCancelacionAndEstado(String token, String estado);
    
    Optional<Turno> findByTokenCancelacion(String token);
    
    @Query("SELECT t.hora FROM Turno t WHERE t.fecha = :fecha AND t.estado = 'CONFIRMADO'")
    List<String> findHorasOcupadasByFecha(@Param("fecha") LocalDate fecha);
}
