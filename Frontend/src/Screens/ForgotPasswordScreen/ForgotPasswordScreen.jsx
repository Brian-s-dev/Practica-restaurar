import React, { useState } from 'react';
import { Link } from 'react-router';
import { forgotPassword } from '../../services/authService';

export const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState('');
    const [mensaje, setMensaje] = useState(null);
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMensaje(null);
        setCargando(true);

        try {
            const data = await forgotPassword(email);
            if (data.ok) {
                setMensaje(data.message);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError(err.message || "Error al solicitar el restablecimiento");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div>
            <h2>Recuperar Contraseña</h2>
            <p>Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Correo electrónico:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" disabled={cargando}>
                    {cargando ? 'Enviando...' : 'Enviar enlace'}
                </button>
            </form>

            {mensaje && <p>{mensaje}</p>}
            {error && <p>{error}</p>}

            <div>
                <Link to="/login">Volver al Login</Link>
            </div>
        </div>
    );
};