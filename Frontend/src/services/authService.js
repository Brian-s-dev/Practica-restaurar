export async function login(email, password) {
    try {
        const response_http = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify({ email: email, password: password })
        })
        const response = await response_http.json()
        return response
    } catch (error) {
        throw new Error("Error al hacer el login")
    }
}

export async function forgotPassword(email) {
    try {
        // CAMBIO 1: La URL ahora coincide exactamente con tu auth.router.js del backend
        const response_http = await fetch('http://localhost:8080/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify({ email }) // Enviamos el email en el body, como espera el controlador
        });
        return await response_http.json();
    } catch (error) {
        throw new Error("Error al solicitar el restablecimiento");
    }
}

export async function resetPassword(token, new_password) {
    try {
        // CAMBIO 2: Pasamos el token por la URL (?reset_token=...) porque así lo configuramos en auth.controller.js
        const response_http = await fetch(`http://localhost:8080/api/auth/reset-password?reset_token=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            // Ya no hace falta el Authorization header aquí, solo enviamos la nueva contraseña en el body
            body: JSON.stringify({ new_password })
        });
        return await response_http.json();
    } catch (error) {
        throw new Error("Error al restablecer la contraseña");
    }
}