package com.barberia.repository;

import com.barberia.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findBySalonIdAndRol(Long salonId, Usuario.Rol rol);
}