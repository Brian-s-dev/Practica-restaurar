import ENVIRONMENT from "../config/environment.config.js";
import mailer_transport from "../config/mailer.config.js";
import ServerError from "../helpers/serverError.helper.js";


class MailService {
    async sendInvitationMemberEmail(invited_email, accept_url, reject_url, role) {
        try {
            await mailer_transport.sendMail({
                from: `"Slack UTN" <${ENVIRONMENT.GMAIL_USERNAME}>`,
                to: invited_email,
                subject: 'Invitación a Espacio de Trabajo',
                html: `
                    <div style="font-family: Arial; padding: 20px; text-align: center;">
                        <h2>¡Has sido invitado!</h2>
                        <p>Alguien te ha invitado a colaborar en un espacio de trabajo con el rol de <b>${role}</b>.</p>
                        <div style="margin: 30px 0; display: flex; justify-content: center; gap: 20px;">
                            <a href="${accept_url}" style="background-color: #28a745; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">ACEPTAR INVITACIÓN</a>
                            <a href="${reject_url}" style="background-color: #dc3545; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">RECHAZAR</a>
                        </div>
                        <p style="font-size: 12px; color: gray;">Si no conoces este espacio, ignora este mensaje o presiona rechazar.</p>
                    </div>
                `
            });
            console.log("¡Correo de invitación enviado a:", invited_email);
        } catch (error) {
            console.error("Error al enviar la invitación:", error);
            throw error
        }
    }

    async sendResetPasswordEmail(to, resetUrl) {
        try {
            const subject = 'Restablecer Contraseña - Aplicación';
            const html = `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #333;">Restablecimiento de Contraseña</h2>
                    <p style="color: #555; font-size: 16px;">
                        Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.
                        Si no fuiste tú, puedes ignorar este correo.
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                            Restablecer Contraseña
                        </a>
                    </div>
                    <p style="color: #777; font-size: 14px;">
                        O copia y pega este enlace en tu navegador:<br>
                        <a href="${resetUrl}" style="color: #007bff;">${resetUrl}</a>
                    </p>
                </div>
            `;

            const info = await mailer_transport.sendMail({
                from: ENVIRONMENT.GMAIL_USERNAME,
                to,
                subject,
                html
            });
            console.log("Correo de restablecimiento enviado:", info.messageId);
            return info;
        } catch (error) {
            console.error("Error al enviar correo de restablecimiento:", error);
            throw new Error("No se pudo enviar el correo de restablecimiento");
        }
    }
}

const mailService = new MailService()
export default mailService