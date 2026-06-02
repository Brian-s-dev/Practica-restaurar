export async function login(email, password) {
    try {
        const response_http = await fetch(
            'http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(
                {
                    email: email,
                    password: password
                }
            )
        }
        )
        const response = await response_http.json()
        return response
    }
    catch (error) {
        throw new Error("Error al hacer el login")
    }
}

export async function forgotPassword(email) {
    try {
        const response_http = await fetch('http://localhost:8080/api/auth/reset-password-request', {
            method: 'POST',
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify({ email })
        });
        return await response_http.json();
    } catch (error) {
        throw new Error("Error al solicitar el restablecimiento");
    }
}

export async function resetPassword(token, new_password) {
    try {
        const response_http = await fetch('http://localhost:8080/api/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}` // Aquí envías el token
            },
            body: JSON.stringify({ new_password })
        });
        return await response_http.json();
    } catch (error) {
        throw new Error("Error al restablecer la contraseña");
    }
}