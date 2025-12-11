import { useState } from "react";
import { useAuth } from "../../components/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    try {
      await login(form);
      navigate("/pos"); // navegación sin recargar
    } catch (err) {
      setError(err.response?.data?.detail || "Credenciales inválidas. Por favor, inténtelo de nuevo.");
    }
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1509042239860-f550ce710b93')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="card shadow-lg p-4" style={{ maxWidth: 400, width: "100%", backdropFilter: "blur(6px)" }}>
        <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>

        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Usuario"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

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

          <button type="submit" className="btn btn-primary w-100">
            Entrar
          </button>
        </form>

        {/* Enlace para volver al Landing */}
        <div className="text-center mt-3">
          <Link to="/" className="text-decoration-none">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
