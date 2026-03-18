package com.barberia.controller;

import com.barberia.dto.CancelarTurnoRequest;
import com.barberia.dto.TurnoRequest;
import com.barberia.model.Turno;
import com.barberia.service.TurnoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/turnos")
@CrossOrigin(origins = "*")
public class TurnoController {
    
    @Autowired
    private TurnoService turnoService;
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> crearTurno(@Valid @RequestBody TurnoRequest request) {
        try {
            Turno turno = turnoService.crearTurno(request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("id", turno.getId());
            response.put("token", turno.getTokenCancelacion());
            response.put("message", "Turno reservado correctamente");
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/fecha/{fecha}")
    public ResponseEntity<List<Turno>> getTurnosPorFecha(@PathVariable String fecha) {
        return ResponseEntity.ok(turnoService.getTurnosPorFecha(fecha));
    }
    
    @GetMapping("/ocupadas/{fecha}")
    public ResponseEntity<List<String>> getHorasOcupadas(@PathVariable String fecha) {
        return ResponseEntity.ok(turnoService.getHorasOcupadas(fecha));
    }
    
    @PostMapping("/cancelar")
    public ResponseEntity<Map<String, Object>> cancelarTurno(@Valid @RequestBody CancelarTurnoRequest request) {
        boolean cancelado = turnoService.cancelarTurno(request.getToken(), request.getEmail());
        
        Map<String, Object> response = new HashMap<>();
        if (cancelado) {
            response.put("success", true);
            response.put("message", "Turno cancelado correctamente");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("error", "No se pudo cancelar el turno. Verifica el email.");
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/token/{token}")
    public ResponseEntity<Map<String, Object>> getTurnoPorToken(@PathVariable String token) {
        Turno turno = turnoService.getTurnoPorToken(token);
        
        Map<String, Object> response = new HashMap<>();
        if (turno != null && "CONFIRMADO".equals(turno.getEstado())) {
            response.put("success", true);
            response.put("servicio", turno.getServicio());
            response.put("fecha", turno.getFecha().toString());
            response.put("hora", turno.getHora());
            response.put("nombre", turno.getNombre());
            response.put("precio", turno.getPrecio());
        } else {
            response.put("success", false);
            response.put("error", "Turno no encontrado");
        }
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<List<Turno>> getAllTurnos() {
        return ResponseEntity.ok(turnoService.getAllTurnos());
    }
}
