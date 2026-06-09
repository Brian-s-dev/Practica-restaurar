import ENVIRONMENT from "../config/environment.config.js";
import ServerError from "../helpers/serverError.helper.js";
import userRepository from "../repositories/user.repository.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mailService from "./mail.service.js";

class AuthService {

    async register(nombre, email, password) {
        const userExists = await userRepository.getByEmail(email);
        if (userExists) {
            throw new ServerError("El usuario ya existe", 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userRepository.create({
            nombre,
            email,
            password: hashedPassword,
            email_verificado: false
        });

        const verificationToken = jwt.sign(
            { email: newUser.email },
            ENVIRONMENT.JWT_SECRET,
            { expiresIn: '24h' }
        );

        const verificationUrl = `${ENVIRONMENT.URL_FRONTEND}/api/auth/verify-email?verification_token=${verificationToken}`;

        await mailService.sendVerificationEmail(email, verificationUrl);

        return newUser;
    }

    async login(email, password) {
        const user = await userRepository.getByEmail(email);
        if (!user) throw new ServerError("Credenciales inválidas", 404);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new ServerError("Credenciales inválidas", 401);

        if (!user.email_verificado) throw new ServerError("Tu correo no ha sido verificado", 403);

        const access_token = jwt.sign(
            {
                id: user._id,
                nombre: user.nombre,
                email: user.email
            },
            ENVIRONMENT.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return { user, access_token };
    }

    async verifyEmail(verification_token) {
        if (!verification_token) throw new ServerError("Falta el token de verificación", 400);

        const decoded = jwt.verify(verification_token, ENVIRONMENT.JWT_SECRET);

        const user = await userRepository.getByEmail(decoded.email);
        if (!user) throw new ServerError("Usuario no encontrado", 404);

        if (user.email_verificado) throw new ServerError("El correo ya fue verificado anteriormente", 400);

        await userRepository.updateById(user._id, { email_verificado: true });

        return user;
    }

    async forgotPassword(email) {
        const user = await userRepository.getByEmail(email);
        if (!user) throw new ServerError("Usuario no encontrado", 404);

        const resetToken = jwt.sign(
            { email: user.email },
            ENVIRONMENT.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const resetUrl = `${ENVIRONMENT.URL_FRONTEND}/reset-password?reset_token=${resetToken}`;

        await mailService.sendResetPasswordEmail(email, resetUrl);
    }

    async resetPassword(reset_token, new_password) {
        if (!reset_token) throw new ServerError("Falta el token de restablecimiento", 400);

        const decoded = jwt.verify(reset_token, ENVIRONMENT.JWT_SECRET);

        const user = await userRepository.getByEmail(decoded.email);
        if (!user) throw new ServerError("Usuario no encontrado", 404);

        const hashedPassword = await bcrypt.hash(new_password, 10);

        await userRepository.updateById(user._id, {
            password: hashedPassword,
            email_verificado: true
        });

        return user;
    }
}

export default new AuthService();