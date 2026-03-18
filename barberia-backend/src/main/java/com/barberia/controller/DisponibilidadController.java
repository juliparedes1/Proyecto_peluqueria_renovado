package com.barberia.controller;

import com.barberia.dto.DisponibilidadDTO;
import com.barberia.model.Disponibilidad;
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
    
    @PostMapping("/inicializar")
    public ResponseEntity<String> inicializar() {
        disponibilidadService.inicializarDisponibilidad();
        return ResponseEntity.ok("Disponibilidad inicializada");
    }
    
    @GetMapping
    public ResponseEntity<List<DisponibilidadDTO>> getAll() {
        List<DisponibilidadDTO> dtos = disponibilidadService.getAllDisponibilidad().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/dias-abiertos")
    public ResponseEntity<List<Integer>> getDiasAbiertos() {
        return ResponseEntity.ok(disponibilidadService.getDiasAbiertos());
    }
    
    @GetMapping("/dia/{diaSemana}")
    public ResponseEntity<DisponibilidadDTO> getDisponibilidadPorDia(@PathVariable Integer diaSemana) {
        Disponibilidad disp = disponibilidadService.getDisponibilidadPorDia(diaSemana);
        if (disp == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toDTO(disp));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<DisponibilidadDTO> actualizarDisponibilidad(
            @PathVariable Long id,
            @RequestBody DisponibilidadDTO dto) {
        
        Disponibilidad disponibilidad = new Disponibilidad(
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
