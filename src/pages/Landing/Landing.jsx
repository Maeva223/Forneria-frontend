// src/pages/Landing/Landing.jsx

import React from "react";
import "./Landing.css";
import { Link } from "react-router-dom"; // Necesario si planeas usar el botón para el POS

// ==========================================================
// 1. IMPORTACIÓN DE IMÁGENES ESTÁTICAS
// ==========================================================
// Asegúrate de que las rutas relativas a assets/ sean correctas.
import portadaImg from "../../assets/portada.png";

// Imágenes de Productos Destacados
import ensaladaImg from "../../assets/ensalada.jpg";
import paniniImg from "../../assets/panini.jpg";
import ciabataImg from "../../assets/ciabata.jpg";
import integralImg from "../../assets/integral.jpg";
import masaMadreImg from "../../assets/masa_madre.jpg";
import canelaImg from "../../assets/canela.jpg";

// Imágenes de Productos Congelados
import lasagnaImg from "../../assets/lasagna.jpg";
import pastaImg from "../../assets/pasta.jpg";
import pescadoImg from "../../assets/pescado.jpg";

export default function Landing() {
  return (
    <>
      {/* HEADER (NAVBAR) EXCLUIDO POR SOLICITUD DEL USUARIO */}
      {/* Si necesitas el navbar en el futuro, puedes descomentar la estructura
          del header aquí, o importarlo como un componente aparte. */}

      <main>
        {/* ========================================================== */}
        {/* HERO / INICIO */}
        {/* ========================================================== */}
        <section id="inicio" className="hero">
          <div className="container">
            <h1 className="hero-title">La Fornería – Tienda de especialidad.</h1>
            <p className="hero-subtitle">
              Honramos nuestras raíces italianas y la cultura del buen comer.
            </p>
            <a href="#contacto" className="btn btn-primary">
              Ven a visitarnos
            </a>
          </div>
        </section>

        {/* ========================================================== */}
        {/* NOSOTROS */}
        {/* ========================================================== */}
        <section id="nosotros" className="nosotros">
          <div className="container">
            <h2 className="section-title">Nosotros</h2>
            <div className="nosotros-grid">
              <div className="nosotros-card">
                <h3>Nuestra Misión</h3>
                <p>
                  "Abastecer a las familias con productos gastronómicos de alta
                  calidad, saludables y sabrosos, ofreciendo una experiencia
                  única basada en la tradición artesanal y el respeto por las
                  distintas necesidades alimentarias, a través de una atención
                  cercana, cálida y comprometida."
                </p>
              </div>
              <div className="nosotros-card">
                <h3>Nuestra Visión</h3>
                <p>
                  "Consolidarse como una marca reconocida por la excelencia de
                  los productos y servicios, expandiendo las capacidades de
                  producción y comercialización, para llevar el sabor y la
                  esencia de La Fornería a nuevos mercados y hogares, manteniendo
                  siempre la esencia artesanal y gourmet."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================== */}
        {/* CARACTERÍSTICAS */}
        {/* ========================================================== */}
        <section id="caracteristicas" className="features">
          <div className="container">
            <h2 className="section-title">Nuestras Características</h2>
            <div className="features-grid">
              <div className="feature-card">
                <h3>Recién Horneado</h3>
                <p>Pan fresco todos los días</p>
              </div>
              <div className="feature-card">
                <h3>Ingredientes Naturales</h3>
                <p>Solo los mejores ingredientes</p>
              </div>
              <div className="feature-card">
                <h3>Artesanal</h3>
                <p>Elaborado con maestría tradicional</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================== */}
        {/* PRODUCTOS DESTACADOS */}
        {/* ========================================================== */}
        <section id="productos" className="productos">
          <div className="container">
            <h2 className="section-title">Productos Destacados</h2>
            <div className="productos-grid">
              <div className="producto-card">
                <img src={ensaladaImg} alt="Ensalada" className="producto-img" />
                <h3>Bowl Ensalada</h3>
                <p>Mix de hojas frescas con aderezo especial.</p>
              </div>
              <div className="producto-card">
                <img src={paniniImg} alt="Panini" className="producto-img" />
                <h3>Panini Artesanal</h3>
                <p>Pan italiano tradicional.</p>
              </div>
              <div className="producto-card">
                <img src={ciabataImg} alt="Ciabata" className="producto-img" />
                <h3>Ciabata</h3>
                <p>Pan rústico italiano.</p>
              </div>
              <div className="producto-card">
                <img src={integralImg} alt="Pan Integral" className="producto-img" />
                <h3>Pan Integral</h3>
                <p>Rico en fibra, elaborado con granos enteros y semillas.</p>
              </div>
              <div className="producto-card">
                <img src={masaMadreImg} alt="Pan de Masa Madre" className="producto-img" />
                <h3>Pan de Masa Madre</h3>
                <p>Fermentación natural de 24 horas para un sabor único.</p>
              </div>
              <div className="producto-card">
                <img src={canelaImg} alt="Rollos de Canela" className="producto-img" />
                <h3>Rollos de Canela</h3>
                <p>Pan dulce glaseado con azúcar de canela.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================== */}
        {/* CONGELADOS */}
        {/* ========================================================== */}
        <section className="productos">
          <div className="container">
            <h2 className="section-title">Congelados</h2>
            <div className="productos-grid">
              <div className="producto-card">
                <img src={lasagnaImg} alt="Lasagna" className="producto-img" />
                <h3>Lasagnas Caseras</h3>
              </div>
              <div className="producto-card">
                <img src={pastaImg} alt="Pastas italianas" className="producto-img" />
                <h3>Pastas italianas</h3>
              </div>
              <div className="producto-card">
                <img src={pescadoImg} alt="Pescados y Mariscos" className="producto-img" />
                <h3>Pescados y Mariscos</h3>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================== */}
        {/* CONTACTO */}
        {/* ========================================================== */}
        <section id="contacto" className="contacto">
          <div className="container">
            <h2 className="section-title">Contacto</h2>
            <div className="contacto-container">
              <div className="contacto-imagen">
                <img
                  src={portadaImg}
                  alt="Portada La Fornería"
                  className="portada-img"
                />
              </div>
              <div className="contacto-info">
                <div className="contacto-card">
                  <h3>Información</h3>
                  <p>La Fornería – Tienda de especialidad</p>
                  <p>Los Arrayanes #901, La Serena</p>
                </div>
                <div className="contacto-card">
                  <h3>Horario de atención</h3>
                  <p>Lunes a Viernes: 8:00 - 20:00</p>
                  <p>Sábado y Domingo: 9:00 - 20:00</p>
                </div>
              </div>
            </div>
            <div className="contacto-social">
              <a
                href="https://www.instagram.com/laforneriaemporio/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-instagram"
              >
                Síguenos en Instagram
              </a>
            </div>
          </div>
        </section>

        {/* ========================================================== */}
        {/* FOOTER */}
        {/* ========================================================== */}
        <footer className="footer">
          <div className="container">
            <p>2025 Easy Design. Todos los derechos reservados.</p>
          </div>
        </footer>
      </main>
    </>
  );
}
