import { useEffect, useMemo, useState } from "react";
import client from "../../api/client";
import "./Configuracion.css";

const EMPLEADO_CREATE_ENDPOINT = "/pos/api/empleados/";
const DEFAULT_ROLE = "Vendedor";

function Configuracion() {
  const [empleado, setEmpleado] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    nombreCompleto: "",
    cargo: DEFAULT_ROLE,
  });
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("empleado");
    setEmpleado(raw ? JSON.parse(raw) : null);
  }, []);

  const isAdmin = useMemo(() => empleado?.cargo === "Administrador", [empleado]);

  useEffect(() => {
    if (isAdmin) {
      loadEmpleados();
    }
  }, [isAdmin]);

  const loadEmpleados = async () => {
    const token = localStorage.getItem("access");
    if (!token) return;

    setLoadingList(true);
    try {
      const { data } = await client.get("/pos/api/empleados/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmpleados(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error("Error cargando empleados:", err);
      setEmpleados([]);
    } finally {
      setLoadingList(false);
    }
  };

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

    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    const token = localStorage.getItem("access");
    if (!token) {
      setError("No hay token de sesión. Inicia sesión nuevamente.");
      return;
    }

    const payload = {
      usuario: form.username,
      password: form.password,
      nombre_completo: form.nombreCompleto,
      cargo: form.cargo,
    };

    setLoading(true);
    try {
      const { data } = await client.post(EMPLEADO_CREATE_ENDPOINT, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(`✅ Empleado ${data?.user?.username || form.username} creado correctamente.`);
      setForm({ username: "", password: "", confirmPassword: "", nombreCompleto: "", cargo: DEFAULT_ROLE });
      setShowForm(false);
      await loadEmpleados();
    } catch (err) {
      const apiError = err.response?.data;
      const message = typeof apiError === "string" ? apiError : JSON.stringify(apiError || err.message);
      setError(`❌ No se pudo crear el empleado: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, nombreCompleto) => {
    if (!window.confirm(`¿Estás seguro de eliminar a ${nombreCompleto}?`)) {
      return;
    }

    const token = localStorage.getItem("access");
    if (!token) {
      setError("No hay token de sesión. Inicia sesión nuevamente.");
      return;
    }

    try {
      await client.delete(`/pos/api/empleados/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(`✅ Empleado ${nombreCompleto} eliminado correctamente.`);
      await loadEmpleados();
    } catch (err) {
      const apiError = err.response?.data;
      const message = typeof apiError === "string" ? apiError : JSON.stringify(apiError || err.message);
      setError(`❌ No se pudo eliminar el empleado: ${message}`);
    }
  };

  if (!isAdmin) {
    return (
      <div className="config-page">
        <div className="config-alert config-restricted">
          <h3>🔒 Acceso restringido</h3>
          <p>Solo los administradores pueden gestionar empleados.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="config-page">
      <div className="config-header">
        <h1>⚙️ Configuración</h1>
        <p>Gestiona los empleados de tu empresa</p>
      </div>

      {error && <div className="config-alert config-error">{error}</div>}
      {success && <div className="config-alert config-success">{success}</div>}

      <div className="config-container">
        <div className="config-section">
          <div className="config-section-header">
            <h2>➕ Crear nuevo empleado</h2>
            <button
              className={`config-toggle-btn ${showForm ? "active" : ""}`}
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="config-form">
              <div className="config-form-grid">
                <div className="config-form-group">
                  <label className="config-label">Nombre completo *</label>
                  <input
                    name="nombreCompleto"
                    type="text"
                    className="config-input"
                    placeholder="Ej: Ana Pérez García"
                    value={form.nombreCompleto}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="config-form-group">
                  <label className="config-label">Usuario *</label>
                  <input
                    name="username"
                    type="text"
                    className="config-input"
                    placeholder="Nombre de usuario único"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="config-form-group">
                  <label className="config-label">Contraseña *</label>
                  <input
                    name="password"
                    type="password"
                    className="config-input"
                    placeholder="Mínimo 6 caracteres"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                </div>

                <div className="config-form-group">
                  <label className="config-label">Confirmar contraseña *</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    className="config-input"
                    placeholder="Repite la contraseña"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                </div>

                <div className="config-form-group">
                  <label className="config-label">Cargo *</label>
                  <select
                    name="cargo"
                    className="config-select"
                    value={form.cargo}
                    onChange={handleChange}
                  >
                    <option value="Vendedor">Vendedor</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="config-submit-btn" disabled={loading}>
                {loading ? "⏳ Creando..." : "✓ Crear empleado"}
              </button>
            </form>
          )}
        </div>

        <div className="config-section">
          <div className="config-section-header">
            <h2>👥 Empleados registrados</h2>
            <span className="config-count">{empleados.length}</span>
          </div>

          {loadingList ? (
            <div className="config-loading">Cargando empleados...</div>
          ) : empleados.length === 0 ? (
            <div className="config-empty">No hay empleados registrados</div>
          ) : (
            <div className="config-empleados-list">
              {empleados.map((emp) => (
                <div key={emp.id} className="config-empleado-card">
                  <div className="config-empleado-avatar">
                    {emp.nombre_completo?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="config-empleado-info">
                    <h4>{emp.nombre_completo}</h4>
                    <p className="config-empleado-username">@{emp.user?.username}</p>
                  </div>
                  <div className="config-empleado-cargo">
                    <span className={`config-cargo-badge config-cargo-${emp.cargo?.toLowerCase()}`}>
                      {emp.cargo}
                    </span>
                  </div>
                  <button
                    className="config-delete-btn"
                    onClick={() => handleDelete(emp.id, emp.nombre_completo)}
                    title="Eliminar empleado"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Configuracion;
