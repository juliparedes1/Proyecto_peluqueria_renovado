package com.barberia.controller;

import com.barberia.dto.DisponibilidadDTO;
import com.barberia.dto.ServicioRequest;
import com.barberia.dto.ServicioResponse;
import com.barberia.model.Disponibilidad;
import com.barberia.service.DisponibilidadService;
import com.barberia.service.ServicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/salon")
@CrossOrigin(origins = "*")
public class SalonAdminController {
    
    @Autowired
    private DisponibilidadService disponibilidadService;
    
    @Autowired
    private ServicioService servicioService;
    
    @GetMapping("/{salonId}/disponibilidad")
    public ResponseEntity<List<DisponibilidadDTO>> getDisponibilidad(@PathVariable Long salonId) {
        disponibilidadService.inicializarDisponibilidad(salonId);
        List<DisponibilidadDTO> dtos = disponibilidadService.getAllDisponibilidad(salonId).stream()
            .map(d -> {
                DisponibilidadDTO dto = new DisponibilidadDTO();
                dto.setId(d.getId());
                dto.setDiaSemana(d.getDiaSemana());
                dto.setNombreDia(disponibilidadService.getNombreDia(d.getDiaSemana()));
                dto.setEstaAbierto(d.getEstaAbierto());
                dto.setHoraInicio(d.getHoraInicio());
                dto.setHoraFin(d.getHoraFin());
                return dto;
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    @PutMapping("/{salonId}/disponibilidad")
    public ResponseEntity<List<DisponibilidadDTO>> actualizarDisponibilidad(
            @PathVariable Long salonId,
            @RequestBody List<DisponibilidadDTO> disponibilidades) {
        
        for (DisponibilidadDTO dto : disponibilidades) {
            Disponibilidad disp = disponibilidadService.getDisponibilidadPorDia(salonId, dto.getDiaSemana());
            if (disp != null) {
                disp.setEstaAbierto(dto.getEstaAbierto());
                disp.setHoraInicio(dto.getHoraInicio());
                disp.setHoraFin(dto.getHoraFin());
                disponibilidadService.guardarDisponibilidad(disp);
            }
        }
        
        List<DisponibilidadDTO> result = disponibilidadService.getAllDisponibilidad(salonId).stream()
            .map(d -> {
                DisponibilidadDTO dto = new DisponibilidadDTO();
                dto.setId(d.getId());
                dto.setDiaSemana(d.getDiaSemana());
                dto.setNombreDia(disponibilidadService.getNombreDia(d.getDiaSemana()));
                dto.setEstaAbierto(d.getEstaAbierto());
                dto.setHoraInicio(d.getHoraInicio());
                dto.setHoraFin(d.getHoraFin());
                return dto;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/{salonId}/servicios")
    public ResponseEntity<List<ServicioResponse>> getServicios(@PathVariable Long salonId) {
        return ResponseEntity.ok(servicioService.listarServicios(salonId));
    }
    
    @PostMapping("/{salonId}/servicios")
    public ResponseEntity<ServicioResponse> crearServicio(
            @PathVariable Long salonId,
            @RequestBody ServicioRequest request) {
        return ResponseEntity.ok(servicioService.crearServicio(salonId, request));
    }
    
    @PutMapping("/{salonId}/servicios/{servicioId}")
    public ResponseEntity<ServicioResponse> actualizarServicio(
            @PathVariable Long salonId,
            @PathVariable Long servicioId,
            @RequestBody ServicioRequest request) {
        return ResponseEntity.ok(servicioService.actualizarServicio(salonId, servicioId, request));
    }
    
    @DeleteMapping("/{salonId}/servicios/{servicioId}")
    public ResponseEntity<Void> eliminarServicio(
            @PathVariable Long salonId,
            @PathVariable Long servicioId) {
        servicioService.eliminarServicio(salonId, servicioId);
        return ResponseEntity.noContent().build();
    }
}