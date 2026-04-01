package com.barberia.service;

import com.barberia.dto.TurnoRequest;
import com.barberia.model.Salon;
import com.barberia.model.Turno;
import com.barberia.repository.SalonRepository;
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
    private SalonRepository salonRepository;
    
    @Autowired
    private EmailService emailService;
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DISPLAY_FORMATTER = DateTimeFormatter.ofPattern("dd 'de' MMMM 'de' yyyy");
    
    @Transactional
    public Turno crearTurno(TurnoRequest request) {
        LocalDate fecha = LocalDate.parse(request.getFecha(), DATE_FORMATTER);
        
        Salon salon = salonRepository.findById(request.getSalonId())
            .orElseThrow(() -> new RuntimeException("Salón no encontrado"));
        
        boolean ocupado = turnoRepository.findBySalonIdAndFechaAndHoraAndConfirmado(
            request.getSalonId(), fecha, request.getHora()).isPresent();
        if (ocupado) {
            throw new RuntimeException("El horario ya está reservado");
        }
        
        Turno turno = new Turno();
        turno.setSalon(salon);
        turno.setServicio(request.getServicio());
        turno.setPrecio(request.getPrecio());
        turno.setFecha(fecha);
        turno.setHora(request.getHora());
        turno.setNombre(request.getNombre());
        turno.setTelefono(request.getTelefono());
        turno.setEmail(request.getEmail());
        turno.setEstado("CONFIRMADO");
        turno.setTokenCancelacion(java.util.UUID.randomUUID().toString());
        
        Turno guardado = turnoRepository.save(turno);
        
        try {
            String fechaFormateada = fecha.format(DISPLAY_FORMATTER);
            emailService.enviarConfirmacionTurno(guardado, fechaFormateada);
        } catch (Exception e) {
            System.err.println("Error enviando email: " + e.getMessage());
        }
        
        return guardado;
    }
    
    public List<Turno> getTurnosPorFecha(Long salonId, String fecha) {
        LocalDate fechaLocal = LocalDate.parse(fecha, DATE_FORMATTER);
        return turnoRepository.findBySalonIdAndFechaAndEstado(salonId, fechaLocal, "CONFIRMADO");
    }
    
    public List<String> getHorasOcupadas(Long salonId, String fecha) {
        LocalDate fechaLocal = LocalDate.parse(fecha, DATE_FORMATTER);
        return turnoRepository.findHorasOcupadasBySalonIdAndFecha(salonId, fechaLocal);
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
    
    public List<Turno> getAllTurnos(Long salonId) {
        return turnoRepository.findBySalonId(salonId);
    }
}
