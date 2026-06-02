import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router';
import { resetPassword } from '../../services/authService';

export const ResetPasswordScreen = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('reset_password_token');
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [mensaje, setMensaje] = useState(null);
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMensaje(null);

        if (!token) {
            setError("No se encontró el token de seguridad en la URL.");
            return;
        }

        if (newPassword.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        setCargando(true);

        try {
            const data = await resetPassword(token, newPassword);
            if (data.ok) {
                setMensaje("¡Contraseña actualizada con éxito! Redirigiendo al login...");

                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError(err.message || "Error al restablecer la contraseña");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div>
            <h2>Restablecer Contraseña</h2>

            {!token ? (
                <p>Enlace inválido o sin token de seguridad.</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="new_password">Nueva Contraseña:</label>
                        <input
                            type="password"
                            id="new_password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            placeholder="Mínimo 6 caracteres"
                        />
                    </div>

                    <button type="submit" disabled={cargando}>
                        {cargando ? 'Guardando...' : 'Restablecer contraseña'}
                    </button>
                </form>
            )}

            {mensaje && <p>{mensaje}</p>}
            {error && <p>{error}</p>}

            <div>
                <Link to="/login">Ir al Login</Link>
            </div>
        </div>
    );
};