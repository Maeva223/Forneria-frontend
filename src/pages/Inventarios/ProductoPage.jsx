import React from 'react';
// Archivo: ./ProductoPage.jsx

export default function ProductoPage({ productos, selectedProducto, onSelectProducto }) {
    return (
        <div className="d-flex flex-column h-100">
            {/* EL BOTÓN DE "AÑADIR NUEVO PRODUCTO" FUE ELIMINADO DE AQUÍ */}
            
            <ul className="list-group overflow-auto" style={{ maxHeight: 'calc(100vh - 350px)' }}> 
                {productos.map(producto => (
                    <li
                        key={producto.id}
                        className={`list-group-item d-flex justify-content-between align-items-center list-group-item-action ${
                            selectedProducto?.id === producto.id ? 'active' : ''
                        }`}
                        onClick={() => onSelectProducto(producto)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div>
                            <div className="fw-bold">{producto.nombre}</div>
                            <small className="text-muted">SKU: {producto.codigo_barra || 'N/A'}</small>
                        </div>
                        <span className="badge bg-primary rounded-pill">{producto.stock_total}</span>
                    </li>
                ))}
                {productos.length === 0 && (
                    <li className="list-group-item text-center text-muted">No hay productos que coincidan con la búsqueda/filtro.</li>
                )}
            </ul>
        </div>
    );
}