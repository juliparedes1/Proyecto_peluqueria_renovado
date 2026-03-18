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
                turno.getServico(),
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
}
