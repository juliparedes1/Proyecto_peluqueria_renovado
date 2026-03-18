package com.barberia.service;

import com.barberia.dto.TurnoRequest;
import com.barberia.model.Turno;
import com.barberia.repository.TurnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class TurnoService {
    
    @Autowired
    private TurnoRepository turnoRepository;
    
    @Autowired
    private EmailService emailService;
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DISPLAY_FORMATTER = DateTimeFormatter.ofPattern("dd 'de' MMMM 'de' yyyy");
    
    @Transactional
    public Turno crearTurno(TurnoRequest request) {
        LocalDate fecha = LocalDate.parse(request.getFecha(), DATE_FORMATTER);
        
        boolean ocupado = turnoRepository.findByFechaAndHoraAndConfirmado(fecha, request.getHora()).isPresent();
        if (ocupado) {
            throw new RuntimeException("El horario ya está reservado");
        }
        
        Turno turno = new Turno(
                request.getServicio(),
                request.getPrecio(),
                fecha,
                request.getHora(),
                request.getNombre(),
                request.getTelefono(),
                request.getEmail()
        );
        
        Turno guardado = turnoRepository.save(turno);
        
        // Enviar email de confirmación
        try {
            String fechaFormateada = fecha.format(DISPLAY_FORMATTER);
            emailService.enviarConfirmacionTurno(guardado, fechaFormateada);
        } catch (Exception e) {
            System.err.println("Error enviando email: " + e.getMessage());
        }
        
        return guardado;
    }
    
    public List<Turno> getTurnosPorFecha(String fecha) {
        LocalDate fechaLocal = LocalDate.parse(fecha, DATE_FORMATTER);
        return turnoRepository.findByFechaAndEstado(fechaLocal, "CONFIRMADO");
    }
    
    public List<String> getHorasOcupadas(String fecha) {
        LocalDate fechaLocal = LocalDate.parse(fecha, DATE_FORMATTER);
        return turnoRepository.findHorasOcupadasByFecha(fechaLocal);
    }
    
    @Transactional
    public boolean cancelarTurno(String token, String email) {
        Turno turno = turnoRepository.findByTokenCancelacion(token)
                .orElse(null);
        
        if (turno == null) {
            return false;
        }
        
        if (!turno.getEmail().equalsIgnoreCase(email)) {
            return false;
        }
        
        if ("CANCELADO".equals(turno.getEstado())) {
            return false;
        }
        
        turno.setEstado("CANCELADO");
        turno.setUpdatedAt(LocalDateTime.now());
        turnoRepository.save(turno);
        
        return true;
    }
    
    public Turno getTurnoPorToken(String token) {
        return turnoRepository.findByTokenCancelacion(token).orElse(null);
    }
    
    public List<Turno> getAllTurnos() {
        return turnoRepository.findAll();
    }
}
