const API_URL = 'http://localhost:8080/api/workspace';

export async function getWorkspaces() {
    try {
        const token = localStorage.getItem('access_token');
        const response_http = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const response = await response_http.json();
        return response;
    } catch (error) {
        console.error("Error en getWorkspaces:", error);
        throw new Error("Error al obtener los espacios de trabajo");
    }
}

export async function createWorkspace(nombre, descripcion) {
    try {
        const token = localStorage.getItem('access_token');
        const response_http = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nombre, descripcion })
        });
        const response = await response_http.json();
        return response;
    } catch (error) {
        console.error("Error en createWorkspace:", error);
        throw new Error("Error al crear el espacio de trabajo");
    }
}

export async function inviteUserToWorkspace(workspace_id, invited_email, role) {
    try {
        const token = localStorage.getItem('access_token');
        const response_http = await fetch(`${API_URL}/${workspace_id}/members`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ invited_email, role })
        });
        const response = await response_http.json();
        return response;
    } catch (error) {
        console.error("Error en inviteUserToWorkspace:", error);
        throw new Error("Error al enviar la invitación");
    }
}

export async function processInvitation(workspace_id, decision, token) {
    try {
        const response_http = await fetch(`${API_URL}/${workspace_id}/members/${decision}?invitation_token=${token}`, {
            method: 'GET'
        });
        const response = await response_http.json();
        return response;
    } catch (error) {
        console.error("Error en processInvitation:", error);
        throw new Error("Error al procesar la invitación");
    }
}