import React, { useState, useEffect } from 'react';

// Componente Modal para la creación de un nuevo Cliente
function ClientCreationModal({ isOpen, onClose, initialRut, onCreate }) {
    // 1. Estados para los campos del formulario
    const [formData, setFormData] = useState({
        rut: initialRut || '',
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState(null);

    // 2. Efecto para inicializar el RUT si cambia
    useEffect(() => {
        setFormData(prev => ({ ...prev, rut: initialRut || '' }));
    }, [initialRut]);

    // 3. Manejador de cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 4. Manejador de envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        
        // Validación básica
        if (!formData.rut || !formData.nombre) {
            setFormError("El RUT y el Nombre son campos obligatorios.");
            return;
        }

        setIsLoading(true);
        
        // Llama a la función onCreate (pasada desde POS.jsx)
        const success = await onCreate(formData);

        if (success) {
            // Si la creación fue exitosa, cerramos el modal y reseteamos el estado
            setFormData({
                rut: initialRut || '',
                nombre: '',
                email: '',
                telefono: '',
                direccion: '',
            });
            onClose(); 
        } else {
            // Si la creación falla, la función onCreate debe manejar la alerta, 
            // solo mantenemos el error local para referencia.
            setFormError("Fallo al registrar el cliente. Revise la consola.");
        }
        
        setIsLoading(false);
    };

    // Si el modal no está abierto, no renderiza nada
    if (!isOpen) return null;

    return (
        // Estructura básica de Modal de Bootstrap
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    
                    <div className="modal-header">
                        <h5 className="modal-title">Registrar Nuevo Cliente</h5>
                        <button type="button" className="btn-close" onClick={onClose} disabled={isLoading}></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            
                            {formError && <div className="alert alert-danger">{formError}</div>}
                            
                            <div className="row g-3">
                                {/* Campo RUT (no editable o pre-cargado) */}
                                <div className="col-md-4">
                                    <label htmlFor="rut" className="form-label">RUT (*)</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="rut" 
                                        name="rut" 
                                        value={formData.rut} 
                                        onChange={handleChange}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                {/* Campo Nombre */}
                                <div className="col-md-8">
                                    <label htmlFor="nombre" className="form-label">Nombre/Razón Social (*)</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="nombre" 
                                        name="nombre" 
                                        value={formData.nombre} 
                                        onChange={handleChange}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                
                                {/* Campo Email */}
                                <div className="col-md-6">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        id="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                </div>
                                {/* Campo Teléfono */}
                                <div className="col-md-6">
                                    <label htmlFor="telefono" className="form-label">Teléfono</label>
                                    <input 
                                        type="tel" 
                                        className="form-control" 
                                        id="telefono" 
                                        name="telefono" 
                                        value={formData.telefono} 
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Campo Dirección */}
                                <div className="col-12">
                                    <label htmlFor="direccion" className="form-label">Dirección</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="direccion" 
                                        name="direccion" 
                                        value={formData.direccion} 
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                            
                        </div>

                        <div className="modal-footer">
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Registrando...
                                    </>
                                ) : 'Guardar Cliente y Seleccionar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ClientCreationModal;