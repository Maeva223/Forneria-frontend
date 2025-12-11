import { useState, useEffect, useCallback } from "react";
import client from "../../api/client";
import Loader from "../../components/UI/Loader";
import Pagination from "../../components/UI/Pagination";
import Badge from "../../components/UI/Badge";
import { Link } from "react-router-dom";

export default function ClientesList() {
  const [authToken] = useState(() => localStorage.getItem("access") || null);

  // Estados principales
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filtros
  const [filters, setFilters] = useState({ rut: "", nombre: "" });
  const [appliedFilters, setAppliedFilters] = useState({ rut: "", nombre: "" });

  // Cliente seleccionado y sus compras
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [compras, setCompras] = useState([]);
  const [loadingCompras, setLoadingCompras] = useState(false);
  const [errorCompras, setErrorCompras] = useState(null);

  // Modal Boleta
  const [selectedVentaBoleta, setSelectedVentaBoleta] = useState(null);
  const [loadingBoleta, setLoadingBoleta] = useState(false);

  // --- CARGAR CLIENTES ---
  const loadClientes = useCallback(async () => {
    if (!authToken) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const config = { headers: { Authorization: `Bearer ${authToken}` } };
      const { data } = await client.get("/pos/api/clientes/", {
        ...config,
        params: {
          page,
          rut: appliedFilters.rut.trim(),
          nombre: appliedFilters.nombre.trim(),
        },
      });

      if (Array.isArray(data)) {
         setClientes(data);
         setTotalPages(1);
      } else {
         setClientes(data.results || []); 
         setTotalPages(data.total_pages || 1); 
      }
    } catch (err) {
      console.error(err);
      setError({ message: "Error al cargar clientes." });
    } finally {
      setLoading(false);
    }
  }, [authToken, page, appliedFilters]);

  useEffect(() => {
    loadClientes();
  }, [loadClientes]);

  // --- FILTROS ---
  function applyFilters() {
    if (filters.rut !== appliedFilters.rut || filters.nombre !== appliedFilters.nombre) {
        setAppliedFilters({ ...filters });
        setPage(1);
        setSelectedCliente(null);
    }
  }

  function clearFilters() {
    setFilters({ rut: "", nombre: "" });
    setAppliedFilters({ rut: "", nombre: "" });
    setPage(1);
  }

  // --- CARGAR HISTORIAL ---
  const loadCompras = useCallback(async (rut) => {
    if (!authToken) return;
    setLoadingCompras(true);
    setErrorCompras(null);
    setCompras([]);
    try {
      const config = { headers: { Authorization: `Bearer ${authToken}` } };
      const { data } = await client.get(`/pos/api/clientes/${rut}/`, config); 
      
      const lista = data.ventas || data.compras || [];
      setCompras(Array.isArray(lista) ? lista : lista.results || []);
    } catch (err) {
      console.error(err);
      setErrorCompras("Error cargando historial.");
    } finally {
      setLoadingCompras(false);
    }
  }, [authToken]);

  function handleSelectCliente(cliente) {
    if (selectedCliente && selectedCliente.id === cliente.id) {
        setSelectedCliente(null);
        setCompras([]);
    } else {
        setSelectedCliente(cliente);
        loadCompras(cliente.rut);
    }
  }

  // --- MODAL BOLETA ---
  const openBoletaModal = async (ventaId) => {
    setLoadingBoleta(true);
    try {
        const config = { headers: { Authorization: `Bearer ${authToken}` } };
        const { data } = await client.get(`/pos/api/ventas/${ventaId}/`, config);
        setSelectedVentaBoleta(data);
    } catch (error) {
        console.error("Error modal:", error);
    } finally {
        setLoadingBoleta(false);
    }
  };

  if (!authToken) return <div className="alert alert-danger m-4">No autenticado.</div>;

  return (
    <div className="container-fluid py-4">
      {/* MODAL (Recibo Térmico) */}
      {selectedVentaBoleta && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content shadow">
              <div className="modal-header bg-light">
                <h5 className="modal-title">🧾 Detalle Venta</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedVentaBoleta(null)}></button>
              </div>
              <div className="modal-body font-monospace small">
                <div className="text-center mb-3">
                    <h5 className="fw-bold mb-0">MI NEGOCIO</h5>
                    <p className="mb-0 text-muted">Folio: {selectedVentaBoleta.folio_documento}</p>
                    <p>{new Date(selectedVentaBoleta.fecha).toLocaleString("es-CL")}</p>
                </div>
                <hr className="border-secondary border-dashed" />
                <div className="mb-2">
                    <div><strong>Cliente:</strong> {selectedVentaBoleta.cliente_nombre}</div>
                    <div><strong>Vendedor:</strong> {selectedVentaBoleta.vendedor_nombre}</div>
                </div>
                <table className="table table-sm table-borderless mb-0">
                    <thead><tr className="border-bottom border-dark"><th>Item</th><th className="text-center">Cnt</th><th className="text-end">Total</th></tr></thead>
                    <tbody>
                        {selectedVentaBoleta.detalles?.map((item, idx) => (
                            <tr key={idx}>
                                <td>{item.producto_nombre}</td>
                                <td className="text-center">{item.cantidad}</td>
                                <td className="text-end">${parseFloat(item.subtotal).toLocaleString("es-CL")}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <hr className="border-secondary border-dashed" />
                <div className="d-flex justify-content-between fw-bold fs-5">
                    <span>TOTAL:</span>
                    <span>${parseFloat(selectedVentaBoleta.total).toLocaleString("es-CL")}</span>
                </div>
                {/* Pagos */}
                {selectedVentaBoleta.pagos?.length > 0 && (
                     <div className="mt-3 bg-light p-2 rounded">
                        <small className="fw-bold">Pagos:</small>
                        {selectedVentaBoleta.pagos.map((p, i) => (
                            <div key={i} className="d-flex justify-content-between">
                                <span>{p.metodo}</span><span>${parseFloat(p.monto).toLocaleString("es-CL")}</span>
                            </div>
                        ))}
                        <div className="d-flex justify-content-between border-top border-secondary mt-1 pt-1">
                            <span>Vuelto:</span><span>${parseFloat(selectedVentaBoleta.pagos[0]?.vuelto || 0).toLocaleString("es-CL")}</span>
                        </div>
                     </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedVentaBoleta(null)}>Cerrar</button>
                <button className="btn btn-primary" onClick={() => window.print()}>Imprimir</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <h2>Clientes</h2>
      <p>Gestión de clientes y revisión de historial.</p>

      <div className="row g-4">
        {/* === COLUMNA IZQUIERDA: LISTA === */}
        <div className="col-lg-7">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Listado</h5>
            </div>
            <div className="card-body d-flex flex-column">
              {/* Filtros */}
              <div className="row g-2 mb-3 border-bottom pb-3">
                <div className="col-6"><input className="form-control form-control-sm" placeholder="RUT" value={filters.rut} onChange={(e) => setFilters(f => ({ ...f, rut: e.target.value }))} /></div>
                <div className="col-6"><input className="form-control form-control-sm" placeholder="Nombre" value={filters.nombre} onChange={(e) => setFilters(f => ({ ...f, nombre: e.target.value }))} /></div>
                <div className="col-12 d-flex gap-2">
                    <button className="btn btn-primary btn-sm flex-grow-1" onClick={applyFilters}>Filtrar</button>
                    <button className="btn btn-secondary btn-sm flex-grow-1" onClick={clearFilters}>Limpiar</button>
                </div>
              </div>
              {/* Tabla */}
              {loading ? <Loader /> : error ? <div className="alert alert-danger">{error.message}</div> : (
                <>
                  <div className="table-responsive flex-grow-1">
                    <table className="table table-striped table-hover table-sm">
                      <thead className="sticky-top bg-light">
                        <tr>
                          <th>RUT</th>
                          <th>Nombre</th>
                          <th className="text-center">Compras</th> {/* NUEVA COLUMNA */}
                        </tr>
                      </thead>
                      <tbody>
                        {clientes.map((c) => (
                          <tr key={c.id} style={{ cursor: "pointer" }} onClick={() => handleSelectCliente(c)} className={selectedCliente?.id === c.id ? "table-primary fw-bold" : ""}>
                            <td>{c.rut}</td>
                            <td className="text-primary">{c.nombre}</td>
                            {/* Mostrar total_compras del backend */}
                            <td className="text-center">
                                <span className="badge bg-secondary rounded-pill">{c.total_compras || 0}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="d-flex justify-content-between mt-3 pt-2 border-top">
                    <Badge text={`${clientes.length} resultados`} variant="info" />
                    <Pagination page={page} totalPages={totalPages} setPage={setPage} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* === COLUMNA DERECHA: DETALLE === */}
        <div className="col-lg-5">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Historial {selectedCliente ? `- ${selectedCliente.nombre}` : ""}</h5>
            </div>
            <div className="card-body">
              {!selectedCliente ? (
                <div className="alert alert-secondary text-center py-5">Selecciona un cliente.</div>
              ) : (
                <>
                  <div className="mb-3 border-bottom pb-3">
                    <h6 className="fw-bold text-success">Datos</h6>
                    <ul className="list-group list-group-flush small">
                        <li className="list-group-item px-0 py-1"><strong>RUT:</strong> {selectedCliente.rut}</li>
                        <li className="list-group-item px-0 py-1"><strong>Correo:</strong> {selectedCliente.correo || "-"}</li>
                        <li className="list-group-item px-0 py-1"><Link to={`/clientes/${selectedCliente.rut}`} className="btn btn-sm btn-outline-primary mt-1 w-100">Ver Ficha Completa</Link></li>
                    </ul>
                  </div>

                  <h6 className="fw-bold text-success mb-2">Compras Recientes</h6>
                  {loadingCompras ? <Loader /> : compras.length === 0 ? <div className="alert alert-info">Sin historial.</div> : (
                    <div className="accordion accordion-flush" id="accordionCompras">
                      {compras.map((venta) => (
                        <div className="accordion-item" key={venta.id}>
                          <h2 className="accordion-header" id={`h${venta.id}`}>
                            <button className="accordion-button collapsed py-2" type="button" data-bs-toggle="collapse" data-bs-target={`#c${venta.id}`}>
                              <div className="d-flex justify-content-between w-100 pe-3 small">
                                <span>#{venta.folio_documento || venta.id} <span className="text-muted ms-1">({new Date(venta.fecha).toLocaleDateString("es-CL")})</span></span>
                                <span className="fw-bold text-success">${parseFloat(venta.total).toLocaleString("es-CL")}</span>
                              </div>
                            </button>
                          </h2>
                          <div id={`c${venta.id}`} className="accordion-collapse collapse" data-bs-parent="#accordionCompras">
                            <div className="accordion-body p-2 bg-light">
                                {/* LISTA DE PRODUCTOS DENTRO DEL ACORDEÓN */}
                                <h6 className="small fw-bold text-muted mb-2">Detalle de productos:</h6>
                                {venta.detalles && venta.detalles.length > 0 ? (
                                    <div className="table-responsive mb-2">
                                        <table className="table table-sm table-bordered bg-white small mb-0">
                                            <thead><tr><th>Prod</th><th className="text-center">Cant</th><th className="text-end">Sub</th></tr></thead>
                                            <tbody>
                                                {venta.detalles.map((d, i) => (
                                                    <tr key={i}>
                                                        <td>{d.producto_nombre}</td>
                                                        <td className="text-center">{d.cantidad}</td>
                                                        <td className="text-end">${parseFloat(d.subtotal).toLocaleString("es-CL")}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="small text-muted fst-italic">Información de productos no disponible en vista rápida.</p>
                                )}
                                
                                <div className="d-grid gap-2 mt-2">
                                    <button 
                                        className="btn btn-sm btn-outline-dark"
                                        onClick={() => openBoletaModal(venta.id)}
                                        disabled={loadingBoleta}
                                    >
                                        <i className="bi bi-receipt"></i> Ver Boleta Completa
                                    </button>
                                </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}