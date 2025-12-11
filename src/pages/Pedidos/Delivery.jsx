import { useState, useEffect, useMemo, useCallback } from "react";
import client from "../../api/client";
import endpoints from "../../api/endpoints";
import Loader from "../../components/UI/Loader";
import "./Delivery.css";
import { Decimal } from "decimal.js";

// Importar imágenes
import bowlImg from "../../assets/ensalada.jpg";
import paniniImg from "../../assets/panini.jpg";
import ciabataImg from "../../assets/ciabata.jpg";
import panIntegralImg from "../../assets/integral.jpg";
import panMadreMasaImg from "../../assets/masa_madre.jpg";
import rollosImg from "../../assets/canela.jpg";
import lasagnaImg from "../../assets/lasagna.jpg";
import pastasImg from "../../assets/pasta.jpg";
import pescadoImg from "../../assets/pescado.jpg";
import cafeImg from "../../assets/cafe.jpg";

// Mapeo de productos a imágenes
const productImageMap = {
  "Bowl Ensalada": bowlImg,
  "Panini Artesanal": paniniImg,
  "Ciabata": ciabataImg,
  "Pan Integral": panIntegralImg,
  "Pan de Masa Madre": panMadreMasaImg,
  "Rollos de Canela": rollosImg,
  "Lasagnas Caseras": lasagnaImg,
  "Pastas Italianas": pastasImg,
  "Pescados y Mariscos": pescadoImg,
  "Café": cafeImg
};

const getProductImage = (productName) => {
  return productImageMap[productName] || null;
};

const formatCurrency = (value) => {
  const numericValue = value instanceof Decimal ? value.round().toNumber() : new Decimal(value || 0).round().toNumber();
  if (isNaN(numericValue)) return "Error";
  return numericValue.toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  });
};

export default function Delivery() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cart, setCart] = useState([]);
  const [buscar, setBuscar] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState("products"); // "products", "cart", "address", "confirmation"
  const [authToken] = useState(() => localStorage.getItem("access") || null);

  // Estado de formulario de dirección
  const [direccion, setDireccion] = useState({
    calle: "",
    numero: "",
    sinNumero: false,
    ciudad: "",
    referencias: "",
    instrucciones: ""
  });

  const [clienteInfo, setClienteInfo] = useState({
    nombre: "",
    telefono: "",
    email: ""
  });

  const fetchData = useCallback(async () => {
    const token = authToken || localStorage.getItem("access");
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const productosRes = await client.get(endpoints.productos.list, config);
      const productosConNumeros = productosRes.data.map(p => ({
        ...p,
        precio_venta: new Decimal(p.precio_venta || 0),
        stock_fisico: parseInt(p.stock_fisico || 0, 10),
      }));
      setProductos(productosConNumeros);

      const categoriasRes = await client.get(endpoints.categorias.list, config);
      setCategorias(categoriasRes.data);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError("Error de conexión al cargar productos.");
    } finally {
      setIsLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredProductos = useMemo(() => {
    let filtered = productos;

    if (categoriaSeleccionada) {
      filtered = filtered.filter(p => p.categoria === parseInt(categoriaSeleccionada));
    }

    if (buscar) {
      const term = buscar.toLowerCase();
      filtered = filtered.filter(p => p.nombre?.toLowerCase().includes(term));
    }

    return filtered;
  }, [productos, buscar, categoriaSeleccionada]);

  const handleAddToCart = (producto) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === producto.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prevCart, { ...producto, cantidad: 1 }];
    });
  };

  const handleRemoveFromCart = (productoId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productoId));
  };

  const handleUpdateQuantity = (productoId, cantidad) => {
    if (cantidad <= 0) {
      handleRemoveFromCart(productoId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productoId ? { ...item, cantidad } : item
        )
      );
    }
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const itemPrice = new Decimal(item.precio_venta || 0);
      return sum.plus(itemPrice.times(item.cantidad));
    }, new Decimal(0));
  }, [cart]);

  const handleConfirmOrder = async () => {
    if (cart.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    if (!clienteInfo.nombre || !clienteInfo.telefono) {
      alert("Por favor completa tu nombre y teléfono");
      return;
    }

    if (!direccion.calle || !direccion.numero || !direccion.ciudad) {
      alert("Por favor completa tu dirección");
      return;
    }

    const token = authToken || localStorage.getItem("access");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const ventaData = {
      cliente_id: null, // Consumidor final
      canal: 'delivery',
      items: cart.map(item => ({
        producto_id: item.id,
        cantidad: item.cantidad,
        precio_unitario: item.precio_venta.toString()
      })),
      pagos: [{
        metodo: "PEN",
        monto: cartTotal.toString(),
        monto_recibido: cartTotal.toString()
      }],
      direccion_entrega: `${direccion.calle} ${direccion.numero}${direccion.sinNumero ? ' (sin número)' : ''}, ${direccion.ciudad}`,
      referencias: direccion.referencias,
      instrucciones: direccion.instrucciones,
      cliente_nombre: clienteInfo.nombre,
      cliente_telefono: clienteInfo.telefono,
      cliente_email: clienteInfo.email
    };

    try {
      await client.post(endpoints.ventas.create, ventaData, config);
      alert(`¡Pedido realizado exitosamente!\nTotal: ${formatCurrency(cartTotal)}`);
      
      // Reset
      setCart([]);
      setDireccion({
        calle: "",
        numero: "",
        sinNumero: false,
        ciudad: "",
        referencias: "",
        instrucciones: ""
      });
      setClienteInfo({
        nombre: "",
        telefono: "",
        email: ""
      });
      setStep("products");
    } catch (err) {
      console.error("Error al procesar pedido:", err);
      alert("Error al procesar tu pedido. Intenta nuevamente.");
    }
  };

  return (
    <div className="delivery-page">
      {step === "products" && (
        <div className="delivery-products">
          <div className="delivery-header">
            <h1>La Fornería - Delivery</h1>
            <p>Elige tus productos favoritos</p>
          </div>

          {isLoading ? (
            <div className="delivery-loading"><Loader /></div>
          ) : error ? (
            <div className="delivery-error">{error}</div>
          ) : (
            <>
              <div className="delivery-toolbar">
                <input
                  type="text"
                  className="delivery-search"
                  placeholder="Buscar producto..."
                  value={buscar}
                  onChange={(e) => setBuscar(e.target.value)}
                />
                <select
                  className="delivery-category-select"
                  value={categoriaSeleccionada}
                  onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="delivery-products-grid">
                {filteredProductos.length === 0 ? (
                  <div className="delivery-empty">No hay productos que coincidan con tu búsqueda.</div>
                ) : (
                  filteredProductos.map(producto => (
                    <div key={producto.id} className="delivery-product-card">
                      <div className="delivery-product-image">
                        {getProductImage(producto.nombre) ? (
                          <img src={getProductImage(producto.nombre)} alt={producto.nombre} className="delivery-product-img" />
                        ) : (
                          <div className="delivery-product-placeholder">{producto.nombre.charAt(0)}</div>
                        )}
                      </div>
                      <div className="delivery-product-info">
                        <h3>{producto.nombre}</h3>
                        <p className="delivery-product-brand">{producto.categoria_nombre}</p>
                        <div className="delivery-product-price">
                          {formatCurrency(producto.precio_venta)}
                        </div>
                        <button
                          className="delivery-add-btn"
                          onClick={() => handleAddToCart(producto)}
                          disabled={producto.stock_fisico === 0}
                        >
                          {producto.stock_fisico === 0 ? "Sin stock" : "Agregar"}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <button
                  className="delivery-cart-fixed"
                  onClick={() => setStep("cart")}
                >
                  Ver carrito ({cart.length}) - {formatCurrency(cartTotal)}
                </button>
              )}
            </>
          )}
        </div>
      )}

      {step === "cart" && (
        <div className="delivery-cart">
          <div className="delivery-header">
            <button className="delivery-back-btn" onClick={() => setStep("products")}>← Volver</button>
            <h1>Tu carrito</h1>
          </div>

          {cart.length === 0 ? (
            <div className="delivery-empty">Tu carrito está vacío</div>
          ) : (
            <>
              <div className="delivery-cart-items">
                {cart.map(item => (
                  <div key={item.id} className="delivery-cart-item">
                    <div className="delivery-cart-item-info">
                      <h4>{item.nombre}</h4>
                      <p>{formatCurrency(item.precio_venta)} c/u</p>
                    </div>
                    <div className="delivery-cart-item-controls">
                      <button onClick={() => handleUpdateQuantity(item.id, item.cantidad - 1)}>−</button>
                      <input
                        type="number"
                        value={item.cantidad}
                        onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 0)}
                        min="1"
                      />
                      <button onClick={() => handleUpdateQuantity(item.id, item.cantidad + 1)}>+</button>
                    </div>
                    <div className="delivery-cart-item-price">
                      {formatCurrency(new Decimal(item.precio_venta).times(item.cantidad))}
                    </div>
                    <button
                      className="delivery-remove-btn"
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>

              <div className="delivery-cart-total">
                <strong>Total: {formatCurrency(cartTotal)}</strong>
              </div>

              <button
                className="delivery-continue-btn"
                onClick={() => setStep("address")}
              >
                Continuar
              </button>
            </>
          )}
        </div>
      )}

      {step === "address" && (
        <div className="delivery-address">
          <div className="delivery-header">
            <button className="delivery-back-btn" onClick={() => setStep("cart")}>← Volver</button>
            <h1>Confirma tu dirección</h1>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setStep("confirmation"); }} className="delivery-form">
            <div className="delivery-form-section">
              <h3>Información personal</h3>
              <input
                type="text"
                placeholder="Nombre completo"
                value={clienteInfo.nombre}
                onChange={(e) => setClienteInfo({...clienteInfo, nombre: e.target.value})}
                required
              />
              <input
                type="tel"
                placeholder="Teléfono"
                value={clienteInfo.telefono}
                onChange={(e) => setClienteInfo({...clienteInfo, telefono: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Email (opcional)"
                value={clienteInfo.email}
                onChange={(e) => setClienteInfo({...clienteInfo, email: e.target.value})}
              />
            </div>

            <div className="delivery-form-section">
              <h3>Dirección de entrega</h3>
              <div className="delivery-form-row">
                <input
                  type="text"
                  placeholder="Calle"
                  value={direccion.calle}
                  onChange={(e) => setDireccion({...direccion, calle: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Número"
                  value={direccion.numero}
                  onChange={(e) => setDireccion({...direccion, numero: e.target.value})}
                  disabled={direccion.sinNumero}
                />
                <label>
                  <input
                    type="checkbox"
                    checked={direccion.sinNumero}
                    onChange={(e) => setDireccion({...direccion, sinNumero: e.target.checked})}
                  />
                  Sin número
                </label>
              </div>
              <input
                type="text"
                placeholder="Ciudad"
                value={direccion.ciudad}
                onChange={(e) => setDireccion({...direccion, ciudad: e.target.value})}
                required
              />
            </div>

            <div className="delivery-form-section">
              <h3>Indicaciones adicionales</h3>
              <textarea
                placeholder="Referencias (ej: cerca del parque, esquina con...)"
                value={direccion.referencias}
                onChange={(e) => setDireccion({...direccion, referencias: e.target.value})}
                rows="2"
              />
              <textarea
                placeholder="Instrucciones para el repartidor"
                value={direccion.instrucciones}
                onChange={(e) => setDireccion({...direccion, instrucciones: e.target.value})}
                rows="2"
              />
            </div>

            <button type="submit" className="delivery-continue-btn">
              Continuar
            </button>
          </form>
        </div>
      )}

      {step === "confirmation" && (
        <div className="delivery-confirmation">
          <div className="delivery-header">
            <button className="delivery-back-btn" onClick={() => setStep("address")}>← Volver</button>
            <h1>Confirma tu pedido</h1>
          </div>

          <div className="delivery-confirmation-content">
            <div className="delivery-confirmation-section">
              <h3>📍 Entrega a:</h3>
              <p><strong>{clienteInfo.nombre}</strong></p>
              <p>{direccion.calle} {direccion.numero}{direccion.sinNumero ? ' (sin número)' : ''}</p>
              <p>{direccion.ciudad}</p>
              {direccion.referencias && <p><small>Referencias: {direccion.referencias}</small></p>}
            </div>

            <div className="delivery-confirmation-section">
              <h3>📦 Tu pedido:</h3>
              {cart.map(item => (
                <div key={item.id} className="delivery-confirmation-item">
                  <span>{item.nombre}</span>
                  <span>x{item.cantidad}</span>
                  <span>{formatCurrency(new Decimal(item.precio_venta).times(item.cantidad))}</span>
                </div>
              ))}
            </div>

            <div className="delivery-confirmation-total">
              <h3>Total a pagar: {formatCurrency(cartTotal)}</h3>
            </div>

            <button
              className="delivery-confirm-btn"
              onClick={handleConfirmOrder}
            >
              Confirmar y enviar pedido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
