package com.barberia.service;

import com.barberia.dto.SalonRequest;
import com.barberia.dto.SalonResponse;
import com.barberia.model.Salon;
import com.barberia.model.Usuario;
import com.barberia.repository.SalonRepository;
import com.barberia.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SalonService {
    
    @Autowired
    private SalonRepository salonRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Transactional
    public SalonResponse crearSalon(SalonRequest request) {
        if (salonRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Ya existe un salón con ese email");
        }
        
        Salon salon = new Salon(
            request.getNombre(),
            request.getEmail(),
            request.getTelefono(),
            request.getUbicacion()
        );
        salon = salonRepository.save(salon);
        
        String nombreAdmin = request.getNombreAdmin() != null ? request.getNombreAdmin() : "Administrador";
        String emailAdmin = request.getEmailAdmin() != null ? request.getEmailAdmin() : "admin@" + request.getEmail();
        String passwordTemporal = UUID.randomUUID().toString().substring(0, 8);
        
        Usuario admin = new Usuario(
            salon,
            nombreAdmin,
            emailAdmin,
            passwordTemporal,
            Usuario.Rol.SALON_ADMIN
        );
        usuarioRepository.save(admin);
        
        try {
            emailService.enviarCredencialesAdmin(emailAdmin, passwordTemporal, salon.getNombre());
        } catch (Exception e) {
            System.err.println("Error al enviar email de credenciales: " + e.getMessage());
        }
        
        SalonResponse response = new SalonResponse();
        response.setId(salon.getId());
        response.setNombre(salon.getNombre());
        response.setEmail(salon.getEmail());
        response.setTelefono(salon.getTelefono());
        response.setUbicacion(salon.getUbicacion());
        response.setEstaActivo(salon.getEstaActivo());
        response.setFechaCreacion(salon.getFechaCreacion());
        response.setEmailAdmin(emailAdmin);
        
        return response;
    }
    
    public List<SalonResponse> listarSalones() {
        return salonRepository.findAll().stream()
            .map(s -> {
                SalonResponse r = new SalonResponse();
                r.setId(s.getId());
                r.setNombre(s.getNombre());
                r.setEmail(s.getEmail());
                r.setTelefono(s.getTelefono());
                r.setUbicacion(s.getUbicacion());
                r.setEstaActivo(s.getEstaActivo());
                r.setFechaCreacion(s.getFechaCreacion());
                return r;
            })
            .collect(Collectors.toList());
    }
    
    public SalonResponse obtenerSalon(Long id) {
        Salon salon = salonRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Salón no encontrado"));
        
        SalonResponse response = new SalonResponse();
        response.setId(salon.getId());
        response.setNombre(salon.getNombre());
        response.setEmail(salon.getEmail());
        response.setTelefono(salon.getTelefono());
        response.setUbicacion(salon.getUbicacion());
        response.setEstaActivo(salon.getEstaActivo());
        response.setFechaCreacion(salon.getFechaCreacion());
        
        usuarioRepository.findBySalonIdAndRol(id, Usuario.Rol.SALON_ADMIN)
            .ifPresent(u -> response.setEmailAdmin(u.getEmail()));
        
        return response;
    }
    
    @Transactional
    public SalonResponse actualizarSalon(Long id, SalonRequest request) {
        Salon salon = salonRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Salón no encontrado"));
        
        salon.setNombre(request.getNombre());
        salon.setTelefono(request.getTelefono());
        salon.setUbicacion(request.getUbicacion());
        
        salon = salonRepository.save(salon);
        
        SalonResponse response = new SalonResponse();
        response.setId(salon.getId());
        response.setNombre(salon.getNombre());
        response.setEmail(salon.getEmail());
        response.setTelefono(salon.getTelefono());
        response.setUbicacion(salon.getUbicacion());
        response.setEstaActivo(salon.getEstaActivo());
        
        return response;
    }
    
    @Transactional
    public void eliminarSalon(Long id) {
        Salon salon = salonRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Salón no encontrado"));
        
        salon.setEstaActivo(false);
        salon.setFechaEliminacion(LocalDateTime.now());
        salonRepository.save(salon);
    }
    
    @Transactional
    public void reactivarSalon(Long id) {
        Salon salon = salonRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Salón no encontrado"));
        
        salon.setEstaActivo(true);
        salon.setFechaEliminacion(null);
        salonRepository.save(salon);
    }
}