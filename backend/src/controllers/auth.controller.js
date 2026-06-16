import ServerError from "../helpers/serverError.helper.js";
import authService from "../services/auth.service.js";

class AuthController {

    async register(request, response) {
        const { nombre, email, password } = request.body;

        if (!nombre || !email || !password) {
            throw new ServerError("Faltan datos obligatorios", 400);
        }

        await authService.register(nombre, email, password);

        return response.status(201).json({
            ok: true,
            message: "Usuario registrado con éxito. Por favor verifica tu correo."
        });
    }

    async login(request, response) {
        const { email, password } = request.body;

        if (!email || !password) {
            throw new ServerError("Faltan datos obligatorios", 400);
        }

        const data = await authService.login(email, password);

        return response.status(200).json({
            ok: true,
            message: "Inicio de sesión exitoso",
            data: {
                user: { id: data.user._id, nombre: data.user.nombre, email: data.user.email },
                access_token: data.access_token
            }
        });
    }

    async verifyEmail(request, response) {
        const { verification_token } = request.query;

        await authService.verifyEmail(verification_token);

        return response.status(200).json({
            ok: true,
            message: "Correo verificado con éxito"
        });
    }

    async forgotPassword(request, response) {
        const { email } = request.body;

        if (!email) throw new ServerError("El correo es obligatorio", 400);

        await authService.forgotPassword(email);

        return response.status(200).json({
            ok: true,
            message: "Si el correo existe, se ha enviado un enlace de recuperación."
        });
    }

    async resetPassword(request, response) {
        const { reset_password_token } = request.query;
        const { new_password } = request.body;

        if (!new_password) throw new ServerError("La nueva contraseña es obligatoria", 400);

        await authService.resetPassword(reset_password_token, new_password);

        return response.status(200).json({
            ok: true,
            message: "Contraseña restablecida con éxito"
        });
    }
}

export default new AuthController();