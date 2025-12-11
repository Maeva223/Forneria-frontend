import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import client from "../../api/client";
import endpoints from "../../api/endpoints";
import Loader from "../../components/UI/Loader";
import Badge from "../../components/UI/Badge";
import "./Inventario.css";

export default function Inventario() {
  const [productos, setProductos] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [loadingLotes, setLoadingLotes] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const authToken = useMemo(() => localStorage.getItem("access"), []);

  const authConfig = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };

  const safeFormat = (value) => (value ? `$${parseFloat(value).toLocaleString("es-CL")}` : "");

  async function loadProductos() {
    if (!authToken) {
      setError("No estás autenticado. Inicia sesión para ver el inventario.");
      setLoadingProductos(false);
      return;
    }

    setLoadingProductos(true);
    setError(null);
    try {
      const { data } = await client.get(endpoints.productos.list, authConfig);
      const list = Array.isArray(data) ? data : data.results || [];
      setProductos(list);
      if (list.length) {
        setSelectedProductId(list[0].id);
        loadLotes(list[0].id);
      }
    } catch (err) {
      console.error("Error cargando productos:", err.response?.data || err);
      const message = err.response?.status === 401
        ? "Acceso denegado. Token inválido o expirado."
        : "No pudimos cargar el inventario. Intenta nuevamente.";
      setError(message);
    } finally {
      setLoadingProductos(false);
    }
  }

  async function loadLotes(productoId) {
    if (!productoId || !authToken) return;
    setLoadingLotes(true);
    try {
      const { data } = await client.get(endpoints.lotes.list, authConfig);
      const allLotes = Array.isArray(data) ? data : data.results || [];
      const lotesFiltrados = allLotes.filter(lote => lote.producto === productoId);
      setLotes(lotesFiltrados);
    } catch (err) {
      console.error("Error cargando lotes:", err.response?.data || err);
      setLotes([]);
    } finally {
      setLoadingLotes(false);
    }
  }

  useEffect(() => {
    loadProductos();
  }, []);

  const filteredProductos = useMemo(() => {
    const term = search.toLowerCase();
    return productos.filter((p) => {
      const matchesText = p.nombre?.toLowerCase().includes(term);
      const isLow = Number(p.stock_fisico || 0) < 20;
      if (stockFilter === "low" && !isLow) return false;
      return matchesText;
    });
  }, [productos, search, stockFilter]);

  const selectedProduct = productos.find((p) => p.id === selectedProductId) || null;

  return (
    <div className="inventory-page">
      <div className="inventory-header">
        <div>
          <p style={{ fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", color: "#0ea5e9", letterSpacing: "0.05em", margin: 0, marginBottom: "0.25rem" }}>Operación &nbsp; Stock</p>
          <h1>Inventario</h1>
        </div>
      </div>

      <div className="inventory-toolbar">
        <div className="toolbar-group">
          <input
            className="toolbar-input"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="toolbar-group">
          <select
            className="toolbar-select"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="all">Todas</option>
            <option value="low">Stock bajo (menor a 20)</option>
          </select>
        </div>
        <Link className="btn-primary" to="/inventario/crear">
          + Nuevo Producto
        </Link>
      </div>

      {loadingProductos ? (
        <div style={{ background: "white", borderRadius: "0.75rem", padding: "2rem", display: "flex", justifyContent: "center" }}><Loader /></div>
      ) : error ? (
        <div className="error-box">{error}</div>
      ) : (
        <div className="inventory-grid">
          {/* Columna izquierda: Lista de Productos */}
          <div className="inventory-card">
            <div className="inventory-card__header">
              <div>
                <p className="eyebrow">Productos</p>
                <h3>Listado</h3>
              </div>
              <Badge text={`${filteredProductos.length} items`} variant="primary" />
            </div>
            <div className="inventory-list">
              {filteredProductos.length === 0 && (
                <div className="empty">Sin productos que coincidan.</div>
              )}
              {filteredProductos.map((p) => {
                const active = p.id === selectedProductId;
                return (
                  <button
                    key={p.id}
                    className={`inventory-list__item ${active ? "is-active" : ""}`}
                    onClick={() => {
                      setSelectedProductId(p.id);
                      loadLotes(p.id);
                    }}
                  >
                    <div>
                      <div className="item-title">{p.nombre}</div>
                      <div className="item-sub">SKU {p.id}</div>
                    </div>
                    <div className="item-meta">
                      <span className={`pill pill-${p.stock_fisico > 20 ? "success" : p.stock_fisico > 0 ? "warning" : "danger"}`}>
                        {p.stock_fisico ?? 0} u.
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Columna derecha: Detalles del Producto y Lotes */}
          <div className="inventory-card">
            <div className="inventory-card__header">
              <div>
                <p className="eyebrow">Lotes</p>
                <h3>{selectedProduct?.nombre || "Selecciona un producto"}</h3>
              </div>
              {selectedProduct && (
                <Link className="ghost-btn" to={`/productos/${selectedProduct.id}/lotes`}>
                  + Agregar Lote
                </Link>
              )}
            </div>

            {!selectedProduct ? (
              <div className="empty">Elige un producto para ver sus lotes.</div>
            ) : loadingLotes ? (
              <div className="centered"><Loader /></div>
            ) : lotes.length === 0 ? (
              <div className="empty">No hay lotes cargados para este producto.</div>
            ) : (
              <div className="lotes-table-wrapper">
                <table className="lotes-table">
                  <thead>
                    <tr>
                      <th>N° Lote</th>
                      <th>Vencimiento</th>
                      <th>Stock Actual</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lotes.map((lote) => (
                      <tr key={lote.id}>
                        <td>{lote.numero_lote}</td>
                        <td>{lote.fecha_caducidad}</td>
                        <td>
                          <span className="pill pill-neutral">{lote.stock_actual}</span>
                        </td>
                        <td>
                          <span className="pill pill-success">{lote.estado || "Vigente"}</span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <Link
                              to={`/productos/${selectedProduct.id}/lotes`}
                              className="action-icon"
                              title="Ver/Editar"
                            >
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" fill="currentColor"/>
                              </svg>
                            </Link>
                            <button
                              className="action-icon action-icon--delete"
                              title="Eliminar"
                              onClick={async () => {
                                if (confirm(`¿Eliminar lote ${lote.numero_lote}?`)) {
                                  try {
                                    await client.delete(endpoints.lotes.delete(lote.id), authConfig);
                                    await loadLotes(selectedProduct.id);
                                    await loadProductos(); // Recargar productos para actualizar stock
                                  } catch (err) {
                                    console.error('Error eliminando lote:', err);
                                    alert('Error al eliminar el lote');
                                  }
                                }
                              }}
                            >
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" fill="currentColor"/>
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" fill="currentColor"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedProduct && (
              <div className="inventory-meta">
                <div>
                  <p className="eyebrow">Precio venta</p>
                  <strong>{safeFormat(selectedProduct.precio_venta)}</strong>
                </div>
                <div>
                  <p className="eyebrow">Stock total</p>
                  <strong>{selectedProduct.stock_fisico ?? 0} u.</strong>
                </div>
                <div>
                  <p className="eyebrow">Categoría</p>
                  <strong>{selectedProduct.categoria_nombre || "—"}</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}