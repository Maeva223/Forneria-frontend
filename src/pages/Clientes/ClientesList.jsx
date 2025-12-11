import { useState, useEffect, useMemo, useCallback } from "react";
import client from "../../api/client";
import endpoints from "../../api/endpoints";
import Loader from "../../components/UI/Loader";
import Pagination from "../../components/UI/Pagination"; // Asegúrate de que este componente exista
import Badge from "../../components/UI/Badge";
import { Link } from "react-router-dom";

export default function ClientesList() {
  // Estado para la autenticación
  const [authToken] = useState(() => localStorage.getItem("access") || null);

  // Estado principal de la lista
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Estado para los filtros controlados por el usuario (UI)
  const [filters, setFilters] = useState({ rut: "", nombre: "" });
  // Estado de los filtros actualmente aplicados (usados en la API/useEffect)
  const [appliedFilters, setAppliedFilters] = useState({ rut: "", nombre: "" });

  // Cliente seleccionado y sus compras
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [compras, setCompras] = useState([]);
  const [loadingCompras, setLoadingCompras] = useState(false);
  const [errorCompras, setErrorCompras] = useState(null);

  /**
   * Carga la lista de clientes desde la API, aplicando paginación y filtros.
   * La corrección incluye la autenticación.
   */
  const loadClientes = useCallback(async () => {
    if (!authToken) {
      setError({ message: "No autenticado. Por favor, inicia sesión." });
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setSelectedCliente(null); // Limpiar cliente seleccionado al cambiar de página/filtros

    try {
      const config = { headers: { Authorization: `Bearer ${authToken}` } };
      
      const { data } = await client.get(endpoints.clientes.list, {
        ...config,
        params: {
          page,
          rut: appliedFilters.rut.trim(),
          nombre: appliedFilters.nombre.trim(),
        },
      });

      // Se asume que la API de DRF (Django Rest Framework) devuelve:
      // { count: N, next: URL, previous: URL, results: [...clientes], total_pages: M }
      setClientes(data.results || data); 
      setTotalPages(data.total_pages || 1); 

    } catch (err) {
      console.error("Error cargando clientes:", err.response?.data || err.message);
      if (err.response && err.response.status === 401) {
         setError({ message: "No autorizado. Su sesión pudo haber expirado (401)." });
      } else {
         setError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [authToken, page, appliedFilters]); // Dependencias: token, página, filtros aplicados

  // Dispara la carga de clientes cuando cambia la página o los filtros aplicados.
  useEffect(() => {
    loadClientes();
    // NOTA: El filtrado ahora se hace en el backend, por eso useMemo ya no es necesario para filtrar.
  }, [loadClientes]);

  // Aplica los filtros controlados, establece la página a 1 y dispara loadClientes.
  function applyFilters() {
    // Solo actualiza los filtros aplicados si hay cambios, para evitar un re-render innecesario.
    if (filters.rut !== appliedFilters.rut || filters.nombre !== appliedFilters.nombre) {
        setAppliedFilters({ ...filters });
        setPage(1); // Siempre resetear a la página 1 al aplicar nuevos filtros
    }
  }

  // Limpia los filtros y establece la página a 1.
  function clearFilters() {
    setFilters({ rut: "", nombre: "" });
    setAppliedFilters({ rut: "", nombre: "" });
    setPage(1);
  }

  /**
   * Carga las compras para un cliente específico (por RUT o ID).
   * La corrección incluye la autenticación.
   */
  const loadCompras = useCallback(async (rut) => {
    if (!authToken) return;

    setLoadingCompras(true);
    setErrorCompras(null);
    setCompras([]);
    
    try {
      const config = { headers: { Authorization: `Bearer ${authToken}` } };
      // Se mantiene el endpoint original, asumiendo que el backend maneja el token.
      const { data } = await client.get(endpoints.clientes.detail(rut), config); 
      setCompras(data.ventas || data.compras || []); // Ajustar si el campo es 'compras'
    } catch (err) {
      console.error("Error cargando compras:", err.response?.data || err.message);
      setErrorCompras("Error al cargar las compras del cliente.");
      setCompras([]);
    } finally {
      setLoadingCompras(false);
    }
  }, [authToken]);

  // Maneja la selección de un cliente y carga sus compras.
  function handleSelectCliente(cliente) {
    // Si se hace clic en el cliente ya seleccionado, se limpia el detalle
    if (selectedCliente && selectedCliente.id === cliente.id) {
        setSelectedCliente(null);
        setCompras([]);
        setErrorCompras(null);
    } else {
        setSelectedCliente(cliente);
        loadCompras(cliente.rut);
    }
  }
  
  // No necesitamos 'columns' ya que estamos usando una tabla HTML simple con onClick en <tr>

  if (!authToken) {
      return (
          <div className="container-fluid py-4">
              <div className="alert alert-danger">
                  **Acceso denegado.** No se encontró el token de autenticación.
              </div>
          </div>
      );
  }

  return (
    <div className="container-fluid py-4">
      <h2>Clientes</h2>
      <p>Listado de clientes registrados en el sistema.</p>

      <div className="row g-4"> {/* g-4 para espacio entre columnas */}
        {/* ========================================================================= */}
        {/* COLUMNA IZQUIERDA: BÚSQUEDA Y LISTADO DE CLIENTES */}
        {/* ========================================================================= */}
        <div className="col-lg-7">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Búsqueda y Listado</h5>
            </div>
            <div className="card-body d-flex flex-column">
              {/* Filtros */}
              <div className="row g-2 mb-3 border-bottom pb-3">
                <div className="col-12">
                  <input
                    className="form-control form-control-sm"
                    placeholder="Filtrar por RUT"
                    value={filters.rut}
                    onChange={(e) => setFilters((f) => ({ ...f, rut: e.target.value }))}
                    disabled={loading}
                  />
                </div>
                <div className="col-12">
                  <input
                    className="form-control form-control-sm"
                    placeholder="Filtrar por Nombre"
                    value={filters.nombre}
                    onChange={(e) => setFilters((f) => ({ ...f, nombre: e.target.value }))}
                    disabled={loading}
                  />
                </div>
                <div className="col-12 d-flex gap-2">
                  <button 
                    className="btn btn-primary btn-sm flex-grow-1" 
                    onClick={applyFilters}
                    disabled={loading}
                  >
                    Filtrar
                  </button>
                  <button 
                    className="btn btn-secondary btn-sm flex-grow-1" 
                    onClick={clearFilters}
                    disabled={loading}
                  >
                    Limpiar
                  </button>
                </div>
              </div>

              {/* Contenido principal (Tabla de clientes) */}
              {loading ? (
                <Loader />
              ) : error ? (
                <div className="alert alert-danger flex-grow-1 d-flex align-items-center justify-content-center">
                    **Error:** {error.message || "Error cargando clientes."}
                </div>
              ) : clientes.length === 0 ? (
                <div className="alert alert-info flex-grow-1 d-flex align-items-center justify-content-center">
                    No hay clientes que coincidan con los filtros.
                </div>
              ) : (
                <>
                  <div className="table-responsive flex-grow-1">
                    <table className="table table-striped table-hover table-sm">
                      <thead className="sticky-top bg-light">
                        <tr>
                          <th>RUT</th>
                          <th>Nombre</th>
                          <th>Correo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clientes.map((cliente) => (
                          <tr 
                            key={cliente.id} 
                            style={{ cursor: "pointer" }}
                            onClick={() => handleSelectCliente(cliente)}
                            className={selectedCliente?.id === cliente.id ? "table-primary fw-bold" : ""}
                          >
                            <td>{cliente.rut}</td>
                            <td className="text-primary">{cliente.nombre}</td>
                            <td>{cliente.correo || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Paginación y Contador */}
                  <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                    <Badge
                      text={`${clientes.length} de N total`} // El total se puede obtener de 'data.count'
                      variant="info"
                    />
                    <Pagination 
                        page={page}
                        totalPages={totalPages}
                        setPage={setPage}
                        isProcessing={loading}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COLUMNA DERECHA: DETALLES Y COMPRAS DEL CLIENTE SELECCIONADO */}
        {/* ========================================================================= */}
        <div className="col-lg-5">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                Detalles {selectedCliente ? `de ${selectedCliente.nombre}` : "del Cliente"}
              </h5>
            </div>
            <div className="card-body">
              {!selectedCliente ? (
                <div className="alert alert-secondary text-center py-5 h-100 d-flex align-items-center justify-content-center">
                  <p className="lead mb-0">
                    <i className="bi bi-arrow-left me-2"></i> Selecciona un cliente de la lista de la izquierda para ver su historial.
                  </p>
                </div>
              ) : (
                <>
                  {/* --- Información del Cliente --- */}
                  <div className="mb-4 pb-3 border-bottom">
                    <h6 className="fw-bold text-success">Información de Contacto 📞</h6>
                    <ul className="list-group list-group-flush small">
                      <li className="list-group-item px-0"><strong>Nombre:</strong> {selectedCliente.nombre}</li>
                      <li className="list-group-item px-0"><strong>RUT:</strong> {selectedCliente.rut}</li>
                      <li className="list-group-item px-0"><strong>Correo:</strong> {selectedCliente.correo || "-"}</li>
                      <li className="list-group-item px-0">
                        {/* Ejemplo de enlace a edición si existe */}
                        <Link to={`/clientes/editar/${selectedCliente.id}`} className="btn btn-sm btn-outline-primary mt-2">
                            Ver o Editar Ficha
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* --- Historial de Compras --- */}
                  <h6 className="fw-bold text-success mb-3">Historial de Compras 🛒</h6>
                  
                  {loadingCompras ? (
                    <Loader />
                  ) : errorCompras ? (
                    <div className="alert alert-danger">{errorCompras}</div>
                  ) : compras.length === 0 ? (
                    <div className="alert alert-info">Sin compras registradas para este cliente.</div>
                  ) : (
                    <div className="accordion accordion-flush" id="accordionCompras">
                      {compras.map((venta, index) => (
                        <div className="accordion-item" key={venta.id}>
                          <h2 className="accordion-header" id={`heading${venta.id}`}>
                            <button
                              className="accordion-button collapsed py-2"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#collapse${venta.id}`}
                              aria-expanded="false"
                              aria-controls={`collapse${venta.id}`}
                            >
                              <div className="d-flex justify-content-between w-100 pe-3 small">
                                <span>
                                  <i className="bi bi-file-text me-1"></i>
                                  **{venta.folio_documento || `#${venta.id}`}** - {new Date(venta.fecha).toLocaleDateString("es-CL")}
                                </span>
                                <span>
                                  **${parseFloat(venta.total).toLocaleString("es-CL")}**
                                  <span className={`badge bg-${venta.estado === "entregado" ? "success" : venta.estado === "pagado" ? "info" : "warning"} ms-2`}>
                                    {venta.estado}
                                  </span>
                                </span>
                              </div>
                            </button>
                          </h2>
                          <div
                            id={`collapse${venta.id}`}
                            className="accordion-collapse collapse"
                            aria-labelledby={`heading${venta.id}`}
                            data-bs-parent="#accordionCompras"
                          >
                            <div className="accordion-body p-3">
                              <h6 className="small fw-bold">Productos:</h6>
                              {venta.productos && venta.productos.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-sm table-bordered small mb-0">
                                      <thead>
                                        <tr>
                                          <th>Producto</th>
                                          <th className="text-center">Cant.</th>
                                          <th className="text-end">Precio Unit.</th>
                                          <th className="text-end">Subtotal</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {venta.productos.map((prod) => (
                                          <tr key={prod.id}>
                                            <td>{prod.nombre}</td>
                                            <td className="text-center">{prod.cantidad}</td>
                                            <td className="text-end">${parseFloat(prod.precio_unitario).toLocaleString("es-CL")}</td>
                                            <td className="text-end">${parseFloat(prod.subtotal).toLocaleString("es-CL")}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                </div>
                              ) : (
                                <p className="text-muted small">No hay productos asociados a este registro.</p>
                              )}
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