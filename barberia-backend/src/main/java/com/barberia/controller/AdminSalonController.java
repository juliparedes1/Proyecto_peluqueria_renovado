package com.barberia.controller;

import com.barberia.dto.SalonRequest;
import com.barberia.dto.SalonResponse;
import com.barberia.service.SalonService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/salons")
@CrossOrigin(origins = "*")
public class AdminSalonController {
    
    @Autowired
    private SalonService salonService;
    
    @PostMapping
    public ResponseEntity<SalonResponse> crearSalon(@Valid @RequestBody SalonRequest request) {
        return ResponseEntity.ok(salonService.crearSalon(request));
    }
    
    @GetMapping
    public ResponseEntity<List<SalonResponse>> listarSalones() {
        return ResponseEntity.ok(salonService.listarSalones());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SalonResponse> obtenerSalon(@PathVariable Long id) {
        return ResponseEntity.ok(salonService.obtenerSalon(id));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<SalonResponse> actualizarSalon(
            @PathVariable Long id, 
            @Valid @RequestBody SalonRequest request) {
        return ResponseEntity.ok(salonService.actualizarSalon(id, request));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarSalon(@PathVariable Long id) {
        salonService.eliminarSalon(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{id}/reactivar")
    public ResponseEntity<Void> reactivarSalon(@PathVariable Long id) {
        salonService.reactivarSalon(id);
        return ResponseEntity.ok().build();
    }
}