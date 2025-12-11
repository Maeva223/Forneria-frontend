import { useEffect, useMemo, useState } from "react";
import client from "../../api/client";

const USER_CREATE_ENDPOINT = "/pos/api/usuarios/"; // Ajusta si tu backend usa otra ruta (ej. /api/auth/register/)
const DEFAULT_ROLE = "Vendedor";

function Configuracion() {
  const [empleado, setEmpleado] = useState(null);
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    nombreCompleto: "",
    cargo: DEFAULT_ROLE,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("empleado");
    setEmpleado(raw ? JSON.parse(raw) : null);
  }, []);

  const isAdmin = useMemo(() => empleado?.cargo === "Administrador", [empleado]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const token = localStorage.getItem("access");
    if (!token) {
      setError("No hay token de sesión. Inicia sesión nuevamente.");
      return;
    }

    const payload = {
      username: form.username,
      password: form.password,
      nombre_completo: form.nombreCompleto,
      cargo: form.cargo,
    };

    setLoading(true);
    try {
      const { data } = await client.post(USER_CREATE_ENDPOINT, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(`Usuario ${data?.username || form.username} creado correctamente.`);
      setForm({ username: "", password: "", confirmPassword: "", nombreCompleto: "", cargo: DEFAULT_ROLE });
    } catch (err) {
      const apiError = err.response?.data;
      const message = typeof apiError === "string" ? apiError : JSON.stringify(apiError || err.message);
      setError(`No se pudo crear el usuario: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="container">
        <h2 className="mb-3">Configuración</h2>
        <div className="alert alert-warning">Solo los administradores pueden gestionar usuarios.</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: "720px" }}>
      <h2 className="mb-3">Configuración</h2>
      <p className="text-muted mb-4">Crear nuevos usuarios para el personal.</p>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nombre completo</label>
              <input
                name="nombreCompleto"
                type="text"
                className="form-control"
                placeholder="Ej: Ana Pérez"
                value={form.nombreCompleto}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Usuario</label>
              <input
                name="username"
                type="text"
                className="form-control"
                placeholder="Nombre de usuario"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Contraseña</label>
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Confirmar contraseña</label>
                <input
                  name="confirmPassword"
                  type="password"
                  className="form-control"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Cargo</label>
              <select
                name="cargo"
                className="form-select"
                value={form.cargo}
                onChange={handleChange}
              >
                <option value="Administrador">Administrador</option>
                <option value="Vendedor">Vendedor</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Creando..." : "Crear usuario"}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-4">
        <h6 className="text-muted">Endpoint usado</h6>
        <code>{USER_CREATE_ENDPOINT}</code>
        <p className="mt-2 text-muted" style={{ fontSize: "0.9rem" }}>
          Ajusta la ruta en el archivo si tu API expone otro endpoint (ejemplo: /api/auth/register/).
        </p>
      </div>
    </div>
  );
}

export default Configuracion;
