import React, { useState } from 'react'
import { Link } from 'react-router'
import useForm from '../../hooks/useForm'
import { login } from '../../services/authService'

export const LoginScreen = () => {

    const initial_form_state = {
        email: '',
        password: ''
    }

    function onSubmit(formData) {
        console.log("un usuario intento iniciar sesion", formData)
        login(formData.email, formData.password)
    }

    const { formState, handleChange, handleSubmit } = useForm(initial_form_state, onSubmit)


    return (
        <div>
            <h1>Iniciar sesion</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input id='email' name='email' type='email' value={formState.email} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="password">Contraseña:</label>
                    <input id='password' name='password' type='password' value={formState.password} onChange={handleChange} />
                </div>

                {/* AQUÍ AGREGAMOS EL ENLACE DE OLVIDÉ MI CONTRASEÑA */}
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