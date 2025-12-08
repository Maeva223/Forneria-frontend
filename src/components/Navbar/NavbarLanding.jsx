// src/components/Navbar/NavbarLanding.jsx
import { Link } from "react-router-dom";
// Asegúrate de que esta ruta a la imagen sea correcta
import logo from "../../assets/logo.png";

export default function NavbarLanding() {
  return (
    // 1. Usamos la clase 'header' definida en el CSS
    <header className="header">
      {/* Usamos el contenedor para centrar, si está definido en el CSS */}
      <div className="container">
        <nav className="nav">
          {/* 2. Usamos la clase 'logo' definida en el CSS */}
          <div className="logo">
            <Link to="/">
              <img src={logo} alt="Fornería Logo" className="logo-img" />
            </Link>
          </div>

          {/* 3. Menú de navegación principal con las clases del CSS */}
          {/* Tu CSS original tiene '.nav-menu' para los enlaces */}
          <ul className="nav-menu">
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#nosotros">Nosotros</a></li>
            <li><a href="#caracteristicas">Nuestros Productos</a></li>
            <li><a href="#contacto">Contacto</a></li>
            <li><Link to="/login">Iniciar Sesion</Link></li>
          </ul>

        </nav>
      </div>
    </header>
  );
}