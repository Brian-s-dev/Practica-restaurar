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

// 1. CORREO DE VERIFICACIÓN
export const sendVerificationEmail = async (email) => {
    try {
        const verification_token = jwt.sign(
            { email: email },
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
        console.error("Error al enviar el correo de verificación:", error);
    }
};

// 2. CORREO DE RESTABLECER CONTRASEÑA
export const sendResetPasswordEmail = async (email, resetUrl) => {
    try {
        await transporter.sendMail({
            from: `"Mi App Backend" <${ENVIRONMENT.GMAIL_USERNAME}>`,
            to: email,
            subject: 'Restablecer tu contraseña',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #333;">Restablecimiento de contraseña</h2>
                    <p>Has solicitado cambiar tu contraseña. Haz clic en el siguiente botón para crear una nueva:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="padding: 12px 25px; background-color: #4A154B; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Restablecer mi contraseña</a>
                    </div>
                    <p style="color: #666; font-size: 14px;">Si no fuiste tú quien solicitó este cambio, puedes ignorar este correo de forma segura.</p>
                </div>
            `
        });
        console.log("¡Correo de restablecimiento enviado exitosamente a:", email);
    } catch (error) {
        console.error("Error al enviar el correo de restablecimiento:", error);
        throw new Error("Hubo un problema al enviar el correo.");
    }
};

export const sendInvitationEmail = async (email, role, urlAceptar, urlRechazar) => {
    try {
        await transporter.sendMail({
            from: `"Slack UTN" <${ENVIRONMENT.GMAIL_USERNAME}>`,
            to: email,
            subject: 'Invitación a Espacio de Trabajo',
            html: `
                <div style="font-family: Arial; padding: 20px; text-align: center;">
                    <h2>¡Has sido invitado!</h2>
                    <p>Alguien te ha invitado a colaborar en un espacio de trabajo con el rol de <b>${role}</b>.</p>
                    <div style="margin: 30px 0; display: flex; justify-content: center; gap: 20px;">
                        <a href="${urlAceptar}" style="background-color: #28a745; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">ACEPTAR INVITACIÓN</a>
                        <a href="${urlRechazar}" style="background-color: #dc3545; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">RECHAZAR</a>
                    </div>
                    <p style="font-size: 12px; color: gray;">Si no conoces este espacio, ignora este mensaje o presiona rechazar.</p>
                </div>
            `
        });
        console.log("¡Correo de invitación enviado a:", email);
    } catch (error) {
        console.error("Error al enviar la invitación:", error);
    }
};