package com.barberia.controller;

import com.barberia.dto.DisponibilidadDTO;
import com.barberia.model.Disponibilidad;
import com.barberia.model.Salon;
import com.barberia.repository.SalonRepository;
import com.barberia.service.DisponibilidadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/disponibilidad")
@CrossOrigin(origins = "*")
public class DisponibilidadController {
    
    @Autowired
    private DisponibilidadService disponibilidadService;
    
    @Autowired
    private SalonRepository salonRepository;
    
    @PostMapping("/inicializar/{salonId}")
    public ResponseEntity<String> inicializar(@PathVariable Long salonId) {
        disponibilidadService.inicializarDisponibilidad(salonId);
        return ResponseEntity.ok("Disponibilidad inicializada");
    }
    
    @GetMapping("/{salonId}")
    public ResponseEntity<List<DisponibilidadDTO>> getAll(@PathVariable Long salonId) {
        List<DisponibilidadDTO> dtos = disponibilidadService.getAllDisponibilidad(salonId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/dias-abiertos/{salonId}")
    public ResponseEntity<List<Integer>> getDiasAbiertos(@PathVariable Long salonId) {
        return ResponseEntity.ok(disponibilidadService.getDiasAbiertos(salonId));
    }
    
    @GetMapping("/dia/{salonId}/{diaSemana}")
    public ResponseEntity<DisponibilidadDTO> getDisponibilidadPorDia(
            @PathVariable Long salonId,
            @PathVariable Integer diaSemana) {
        Disponibilidad disp = disponibilidadService.getDisponibilidadPorDia(salonId, diaSemana);
        if (disp == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toDTO(disp));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<DisponibilidadDTO> actualizarDisponibilidad(
            @PathVariable Long id,
            @RequestBody DisponibilidadDTO dto,
            @RequestParam(defaultValue = "1") Long salonId) {
        
        Salon salon = salonRepository.findById(salonId)
                .orElseThrow(() -> new RuntimeException("Salón no encontrado"));
        
        Disponibilidad disponibilidad = new Disponibilidad(
                salon,
                dto.getDiaSemana(),
                dto.getEstaAbierto(),
                dto.getHoraInicio(),
                dto.getHoraFin()
        );
        disponibilidad.setId(id);
        
        Disponibilidad guardado = disponibilidadService.guardarDisponibilidad(disponibilidad);
        return ResponseEntity.ok(toDTO(guardado));
    }
    
    private DisponibilidadDTO toDTO(Disponibilidad disponibilidad) {
        DisponibilidadDTO dto = new DisponibilidadDTO();
        dto.setId(disponibilidad.getId());
        dto.setDiaSemana(disponibilidad.getDiaSemana());
        dto.setNombreDia(disponibilidadService.getNombreDia(disponibilidad.getDiaSemana()));
        dto.setEstaAbierto(disponibilidad.getEstaAbierto());
        dto.setHoraInicio(disponibilidad.getHoraInicio());
        dto.setHoraFin(disponibilidad.getHoraFin());
        return dto;
    }
}
