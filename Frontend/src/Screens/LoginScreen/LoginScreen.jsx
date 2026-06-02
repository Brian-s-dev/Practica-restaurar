import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router' 
import useForm from '../../hooks/useForm'
import { login } from '../../services/authService'

export const LoginScreen = () => {

    const navigate = useNavigate();

    const [error, setError] = useState(null);

    const initial_form_state = {
        email: '',
        password: ''
    }

    async function onSubmit(formData) {
        setError(null);

        try {
            const data = await login(formData.email, formData.password);

            if (data.ok) {
                console.log("Login exitoso, redirigiendo a la pantalla de bienvenida...");
                navigate('/home');
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError(err.message || "Error al intentar iniciar sesión");
        }
    }

    const { formState, handleChange, handleSubmit } = useForm(initial_form_state, onSubmit)

    return (
        <div>
            <h1>Iniciar sesion</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input id='email' name='email' type='email' value={formState.email} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="password">Contraseña:</label>
                    <input id='password' name='password' type='password' value={formState.password} onChange={handleChange} required />
                </div>

                {error && <p style={{ color: 'red', margin: '10px 0', fontSize: '14px' }}>❌ {error}</p>}

                <div style={{ margin: '10px 0' }}>
                    <Link to={'/forgot-password'} style={{ fontSize: '14px', textDecoration: 'none', color: '#007bff' }}>
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>

                <button type="submit">Iniciar sesion</button>
            </form>

            <p>Si no tienes cuenta <Link to={'/register'}>Registrate</Link></p>
        </div>
    )
}