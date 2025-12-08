import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react"; 
import logo from "../../assets/logo.png";

function NavbarApp() {
    const navigate = useNavigate();
    const [empleado, setEmpleado] = useState(null);

    useEffect(() => {
        const rawEmpleado = localStorage.getItem("empleado");
        const datosEmpleado = rawEmpleado ? JSON.parse(rawEmpleado) : null;
        setEmpleado(datosEmpleado);
    }, []);

    const esAdministrador = empleado?.cargo === "Administrador";
    const esVendedor = empleado?.cargo === "Vendedor";

    function handleLogout() {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("empleado");
        setEmpleado(null); 
        // Redirige a la landing page (ruta raíz /)
        navigate("/"); 
    }

    return (
        <nav className="col-12 col-md-2 col-lg-2 bg-dark text-white d-flex flex-column min-vh-100">
            {/* Bloque superior: logo + usuario */}
            <div className="text-center my-4">
                <img src={logo} alt="Logo" className="img-fluid" style={{ maxHeight: "80px" }} />
                {empleado && (
                    <div className="mt-2">
                        {/* 1. Nombre Completo (Línea Superior) */}
                        {/* Usamos un div para garantizar que sea un bloque */}
                        <div className="mb-1 fw-bold">
                            {empleado.nombre_completo}
                        </div>
                        
                    </div>
                )}
            </div>

            {/* Links arriba */}
            <ul className="nav flex-column text-center">
                {empleado ? (
                    <>
                        {esAdministrador ? (
                            <>
                                <li className="nav-item"><Link className="nav-link text-white" to="/dashboard">Dashboard</Link></li>
                                <li className="nav-item"><Link className="nav-link text-white" to="/pos">Punto de venta</Link></li>  
                                <li className="nav-item"><Link className="nav-link text-white" to="/ventas">Ventas</Link></li>
                                <li className="nav-item"><Link className="nav-link text-white" to="/inventario">Inventario</Link></li>
                                <li className="nav-item"><Link className="nav-link text-white" to="/pedidos">Pedidos</Link></li>
                                <li className="nav-item"><Link className="nav-link text-white" to="/clientes">Clientes</Link></li>
                                <li className="nav-item"><Link className="nav-link text-white" to="/reportes">Reportes</Link></li>
                                <li className="nav-item"><Link className="nav-link text-white" to="/configuracion">Configuración</Link></li>
                            </>
                        ) : esVendedor ? (
                            <>
                                <li className="nav-item"><Link className="nav-link text-white" to="/pos">Punto de venta</Link></li>
                                <li className="nav-item"><Link className="nav-link text-white" to="/pedidos">Pedidos</Link></li>
                                <li className="nav-item"><Link className="nav-link text-white" to="/inventario">Inventario</Link></li>
                                <li className="nav-item"><Link className="nav-link text-white" to="/ventas">Ventas</Link></li>
                            </>
                        ) : (
                            <li className="nav-item"><Link className="nav-link text-white" to="/pos">Punto de venta</Link></li>
                        )}
                    </>
                ) : (
                    <li className="nav-item mt-3">
                        <button onClick={() => navigate("/login")} className="btn btn-warning w-100">
                            Iniciar sesión
                        </button>
                    </li>
                )}
            </ul>

            {/* Botón abajo */}
            {empleado && (
                <div className="mt-auto px-3">
                    <button onClick={handleLogout} className="btn btn-danger w-100">
                        Cerrar sesión
                    </button>
                </div>
            )}

            {/* Footer */}
            <div className="text-center p-3">
                <h6 className="fw-bold mb-0">Easy Design - 2025</h6>
            </div>
        </nav>
    );
}

export default NavbarApp;