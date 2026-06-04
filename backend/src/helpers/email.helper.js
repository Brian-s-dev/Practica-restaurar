import nodemailer from 'nodemailer';
import ENVIRONMENT from '../config/environment.config.js';
import jwt from 'jsonwebtoken';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: ENVIRONMENT.GMAIL_USERNAME,
        pass: ENVIRONMENT.EMAIL_PASSWORD
    }
});

export const sendVerificationEmail = async (email) => {
    try {
        const verification_token = jwt.sign(
            {
                email: email
            },
            ENVIRONMENT.JWT_SECRET
        )

        const url_verificacion = `http://localhost:${ENVIRONMENT.PORT}/api/auth/verify-email?verification_token=${verification_token}`;

        await transporter.sendMail({
            from: `"Mi App Backend" <${ENVIRONMENT.GMAIL_USERNAME}>`,
            to: email,
            subject: 'Verifica tu cuenta',
            html: `
                <h1>¡Bienvenido a la App!</h1>
                <p>Haz click en el siguiente enlace para verificar tu correo:</p>
                <a href="${url_verificacion}" style="padding: 10px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verificar mi correo</a>
            `
        });
        console.log("¡Correo de verificación enviado exitosamente a:", email);
    } catch (error) {
        console.error("Error al enviar el correo con Nodemailer:", error);
    }
};

export const sendInvitationEmail = async (email, role, urlAceptar, urlRechazar) => {
    try {
        await transporter.sendMail({
            from: `"Mi App" <${ENVIRONMENT.GMAIL_USERNAME}>`,
            to: email,
            subject: 'Invitación a Espacio de Trabajo',
            html: `
                <div style="font-family: Arial; padding: 20px; text-align: center;">
                    <h2>¡Has sido invitado!</h2>
                    <p>Has sido invitado a un espacio de trabajo con el rol de <b>${role}</b>.</p>
                    <div style="margin: 30px 0; display: flex; justify-content: center; gap: 20px;">
                        <a href="${urlAceptar}" style="background-color: #28a745; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">ACEPTAR INVITACIÓN</a>
                        <a href="${urlRechazar}" style="background-color: #dc3545; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">RECHAZAR</a>
                    </div>
                </div>
            `
        });
    } catch (error) {
        console.error("Error al enviar la invitación:", error);
    }
};