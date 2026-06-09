import React, { useEffect, useState } from 'react';
import { getWorkspaces, createWorkspace } from '../../services/workspaceService';
import { Link } from 'react-router';

export const HomeScreen = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const fetchWorkspaces = async () => {
    const data = await getWorkspaces();
    if (data.ok) {
      setWorkspaces(data.data.workspaces);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const data = await createWorkspace(nombre, descripcion);
    if (data.ok) {
      alert('Espacio creado con éxito');
      fetchWorkspaces();
      setNombre('');
      setDescripcion('');
    } else {
      alert(data.message);
    }
  };

  return (
    <div>
      <h1>Mis Espacios de Trabajo</h1>

      <form onSubmit={handleCreate}>
        <h3>Crear Nuevo</h3>
        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <button type="submit">Crear</button>
      </form>

      <hr />

      <ul>
        {workspaces.map(ws => (
          <li key={ws._id}>
            {ws.nombre} - {ws.descripcion}
            <Link to={`/workspace/${ws._id}`}> (Entrar e Invitar)</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};