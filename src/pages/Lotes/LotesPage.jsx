import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import client from "../../api/client";
import endpoints from "../../api/endpoints";
import Loader from "../../components/UI/Loader";
import Table from "../../components/UI/Table";

export default function LotesPage() {
  const { productoId } = useParams();
  const [producto, setProducto] = useState(null);
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authToken = useMemo(() => localStorage.getItem("access"), []);

  const authConfig = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };

  // modos: "list" | "form" | "delete"
  const [mode, setMode] = useState("list");
  const [selectedLote, setSelectedLote] = useState(null);
  const [form, setForm] = useState({
    numero_lote: "",
    fecha_elaboracion: "",
    fecha_caducidad: "",
    stock_inicial: 0,
  });

  async function loadLotes() {
    if (!authToken) {
      setError("No estás autenticado.");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      // Obtener el producto primero
      const { data: productoData } = await client.get(endpoints.productos.detail(productoId), authConfig);
      setProducto(productoData);
      
      // Obtener todos los lotes y filtrar por producto
      const { data: lotesData } = await client.get(endpoints.lotes.list, authConfig);
      const lotesFiltrados = (Array.isArray(lotesData) ? lotesData : lotesData.results || [])
        .filter(lote => lote.producto === parseInt(productoId));
      setLotes(lotesFiltrados);
    } catch (err) {
      console.error("Error cargando lotes:", err);
      setError("Error al cargar los lotes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (productoId) {
      loadLotes();
    }
  }, [productoId]);

  async function handleSave(e) {
    e.preventDefault();
    setError(null);
    
    const payload = {
      numero_lote: form.numero_lote,
      fecha_elaboracion: form.fecha_elaboracion,
      fecha_caducidad: form.fecha_caducidad,
      stock_inicial: parseInt(form.stock_inicial),
      producto: parseInt(productoId)
    };
    
    console.log("📦 Guardando lote...");
    console.log("Payload:", payload);
    
    try {
      if (selectedLote) {
        const response = await client.put(endpoints.lotes.update(selectedLote.id), payload, authConfig);
        console.log("✅ Lote actualizado:", response.data);
      } else {
        const response = await client.post(endpoints.lotes.create, payload, authConfig);
        console.log("✅ Lote creado:", response.data);
      }
      setMode("list");
      setSelectedLote(null);
      setForm({
        numero_lote: "",
        fecha_elaboracion: "",
        fecha_caducidad: "",
        stock_inicial: 0,
      });
      await loadLotes();
    } catch (err) {
      console.error("❌ Error completo:", err);
      console.error("Response data:", err.response?.data);
      console.error("Response status:", err.response?.status);
      
      // Mostrar el error completo al usuario
      const errorMsg = err.response?.data 
        ? JSON.stringify(err.response.data, null, 2)
        : err.message || "Error al guardar el lote.";
      setError(errorMsg);
    }
  }

  async function handleDeleteConfirm() {
    setError(null);
    try {
      await client.delete(endpoints.lotes.delete(selectedLote.id), authConfig);
      setMode("list");
      setSelectedLote(null);
      await loadLotes();
    } catch (err) {
      console.error("Error eliminando lote:", err);
      setError(err.response?.data?.detail || "Error al eliminar el lote.");
    }
  }

  const columns = [
    { key: "numero_lote", label: "Lote" },
    { key: "fecha_elaboracion", label: "Elaboración" },
    { key: "fecha_caducidad", label: "Caducidad" },
    { key: "stock_actual", label: "Stock actual" },
    {
      key: "acciones",
      label: "Acciones",
      render: (row) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              setSelectedLote(row);
              setError(null);
              setForm({
                numero_lote: row.numero_lote || "",
                fecha_elaboracion: row.fecha_elaboracion || "",
                fecha_caducidad: row.fecha_caducidad || "",
                stock_inicial: row.stock_actual || 0,
              });
              setMode("form");
            }}
          >
            Editar
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => {
              setSelectedLote(row);
              setMode("delete");
            }}
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container py-4" style={{ maxWidth: "900px" }}>
      <h2>Lotes para {producto?.nombre}</h2>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {mode === "list" && (
        <>
          <div className="mb-3">
            <button
              className="btn btn-primary me-2"
              onClick={() => {
                setSelectedLote(null);
                setError(null);
                setForm({
                  numero_lote: "",
                  fecha_elaboracion: "",
                  fecha_caducidad: "",
                  stock_inicial: 0,
                });
                setMode("form");
              }}
            >
              Crear lote
            </button>
            <a className="btn btn-secondary" href="/inventario">
              Volver al inventario
            </a>
          </div>
          {loading ? <Loader /> : <Table columns={columns} data={lotes} />}
        </>
      )}

      {mode === "form" && (
        <div style={{ maxWidth: "700px" }}>
          <h2>{selectedLote ? "Editar lote" : "Crear lote"}</h2>
          <form onSubmit={handleSave}>
            <div className="mb-2">
              <label className="form-label">Número de lote</label>
              <input
                className="form-control"
                value={form.numero_lote}
                onChange={(e) =>
                  setForm({ ...form, numero_lote: e.target.value })
                }
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Fecha elaboración</label>
              <input
                type="date"
                className="form-control"
                value={form.fecha_elaboracion}
                onChange={(e) =>
                  setForm({ ...form, fecha_elaboracion: e.target.value })
                }
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Fecha caducidad</label>
              <input
                type="date"
                className="form-control"
                value={form.fecha_caducidad}
                onChange={(e) =>
                  setForm({ ...form, fecha_caducidad: e.target.value })
                }
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Stock inicial</label>
              <input
                type="number"
                className="form-control"
                value={form.stock_inicial}
                onChange={(e) =>
                  setForm({ ...form, stock_inicial: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <button className="btn btn-primary me-2" type="submit">
              Guardar
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setMode("list")}
            >
              Volver
            </button>
          </form>
        </div>
      )}

      {mode === "delete" && (
        <div style={{ maxWidth: "700px" }}>
          <h2>Eliminar lote: {selectedLote?.numero_lote}</h2>
          <p>¿Estás seguro que deseas eliminar este lote?</p>
          <button
            className="btn btn-danger me-2"
            onClick={handleDeleteConfirm}
          >
            Eliminar
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setMode("list")}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}
