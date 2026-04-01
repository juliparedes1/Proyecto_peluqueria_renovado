package com.barberia.service;

import com.barberia.dto.ServicioRequest;
import com.barberia.dto.ServicioResponse;
import com.barberia.model.Salon;
import com.barberia.model.Servicio;
import com.barberia.repository.SalonRepository;
import com.barberia.repository.ServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServicioService {
    
    @Autowired
    private ServicioRepository servicioRepository;
    
    @Autowired
    private SalonRepository salonRepository;
    
    @Transactional
    public ServicioResponse crearServicio(Long salonId, ServicioRequest request) {
        Salon salon = salonRepository.findById(salonId)
            .orElseThrow(() -> new RuntimeException("Salón no encontrado"));
        
        Servicio servicio = new Servicio(
            salon,
            request.getNombre(),
            request.getPrecio(),
            request.getDuracionMinutos()
        );
        servicio = servicioRepository.save(servicio);
        
        return toResponse(servicio);
    }
    
    public List<ServicioResponse> listarServicios(Long salonId) {
        return servicioRepository.findBySalonIdAndEstaActivoTrue(salonId).stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }
    
    public ServicioResponse obtenerServicio(Long salonId, Long servicioId) {
        Servicio servicio = servicioRepository.findById(servicioId)
            .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
        
        if (!servicio.getSalon().getId().equals(salonId)) {
            throw new RuntimeException("El servicio no pertenece a este salón");
        }
        
        return toResponse(servicio);
    }
    
    @Transactional
    public ServicioResponse actualizarServicio(Long salonId, Long servicioId, ServicioRequest request) {
        Servicio servicio = servicioRepository.findById(servicioId)
            .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
        
        if (!servicio.getSalon().getId().equals(salonId)) {
            throw new RuntimeException("El servicio no pertenece a este salón");
        }
        
        servicio.setNombre(request.getNombre());
        servicio.setPrecio(request.getPrecio());
        servicio.setDuracionMinutos(request.getDuracionMinutos());
        
        servicio = servicioRepository.save(servicio);
        
        return toResponse(servicio);
    }
    
    @Transactional
    public void eliminarServicio(Long salonId, Long servicioId) {
        Servicio servicio = servicioRepository.findById(servicioId)
            .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
        
        if (!servicio.getSalon().getId().equals(salonId)) {
            throw new RuntimeException("El servicio no pertenece a este salón");
        }
        
        servicio.setEstaActivo(false);
        servicioRepository.save(servicio);
    }
    
    private ServicioResponse toResponse(Servicio servicio) {
        ServicioResponse response = new ServicioResponse();
        response.setId(servicio.getId());
        response.setNombre(servicio.getNombre());
        response.setPrecio(servicio.getPrecio());
        response.setDuracionMinutos(servicio.getDuracionMinutos());
        response.setEstaActivo(servicio.getEstaActivo());
        return response;
    }
}