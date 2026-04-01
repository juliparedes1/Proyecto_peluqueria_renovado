package com.barberia.service;

import com.barberia.model.Turno;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;
    
    public void enviarConfirmacionTurno(Turno turno, String fechaFormateada) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo(turno.getEmail());
        mensaje.setSubject("Confirmación de tu turno - Barbería");
        
        String cuerpo = String.format(
                "Hola %s,\n\n" +
                "Tu turno ha sido confirmado.\n\n" +
                "📅 Fecha: %s\n" +
                "⏰ Hora: %s\n" +
                "💇 Servicio: %s\n" +
                "💵 Precio: $%d\n\n" +
                "¡Te esperamos!\n\n" +
                "Si deseas cancelar tu turno, haz clic en el siguiente enlace:\n" +
                "%s/cancelar?token=%s\n\n" +
                "Saludos,\n" +
                "Barbería",
                turno.getNombre(),
                fechaFormateada,
                turno.getHora(),
                turno.getServicio(),
                turno.getPrecio(),
                frontendUrl,
                turno.getTokenCancelacion()
        );
        
        mensaje.setText(cuerpo);
        
        try {
            mailSender.send(mensaje);
        } catch (Exception e) {
            System.err.println("Error al enviar email: " + e.getMessage());
        }
    }
    
    public void enviarCredencialesAdmin(String email, String password, String nombreSalon) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo(email);
        mensaje.setSubject("Bienvenido a la plataforma - Credenciales de acceso");
        
        String cuerpo = String.format(
            "Bienvenido a la plataforma de gestión de barbería.\n\n" +
            "Se ha creado una cuenta para el salón: %s\n\n" +
            "Credenciales de acceso:\n" +
            "Email: %s\n" +
            "Password temporal: %s\n\n" +
            "Por seguridad, le recomendamos cambiar su contraseña después del primer ingreso.\n\n" +
            "Saludos,\n" +
            "Equipo de Barbería",
            nombreSalon,
            email,
            password
        );
        
        mensaje.setText(cuerpo);
        
        try {
            mailSender.send(mensaje);
        } catch (Exception e) {
            System.err.println("Error al enviar email de credenciales: " + e.getMessage());
        }
    }
}
