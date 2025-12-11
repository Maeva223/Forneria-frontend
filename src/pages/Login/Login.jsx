import { useState } from "react";
import { useAuth } from "../../components/hooks/useAuth";
import { useNavigate } from "react-router-dom";

/**
 * Componente de la página de inicio de sesión.
 * Permite a los usuarios ingresar sus credenciales para acceder al sistema.
 */
export default function Login() {
  // 1. Hooks y Estado
  const { login } = useAuth(); // Función para manejar la lógica de autenticación
  const navigate = useNavigate(); // Hook para la navegación
  const [form, setForm] = useState({ username: "", password: "" }); // Estado para los campos del formulario
  const [error, setError] = useState(""); // Estado para mostrar mensajes de error

  // 2. Manejador de Envío
  /**
   * Maneja el envío del formulario. Intenta iniciar sesión y navega si es exitoso.
   * @param {Event} e - Evento de envío del formulario.
   */
  async function onSubmit(e) {
    e.preventDefault();
    try {
      await login(form);
      // Recargar la ventana para actualizar el navbar con el nuevo empleado
      window.location.href = "/pos";
    } catch (err) {
      // Captura el mensaje de error de la respuesta o usa un mensaje genérico
      setError(err.response?.data?.detail || "Credenciales inválidas. Por favor, inténtelo de nuevo.");
    }
  }

  // 3. Renderizado del Componente
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      {/* Contenedor principal centrado, se puede mejorar con una tarjeta (card) */}
      <div className="card shadow-lg p-4" style={{ maxWidth: 400, width: "100%" }}>
        <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>

        {/* Mostrar Alerta de Error si existe */}
        {error && <div className="alert alert-danger text-center">{error}</div>}

        {/* Formulario de Inicio de Sesión */}
        <form onSubmit={onSubmit}>
          {/* Campo de Usuario */}
          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Usuario"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          {/* Campo de Contraseña */}
          <div className="mb-4">
            <input
              type="password"
              className="form-control"
              placeholder="Contraseña"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {/* Botón de Envío */}
          <button type="submit" className="btn btn-primary w-100">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}