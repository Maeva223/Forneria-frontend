import React, { useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';

export default function DeleteConfirmModal({ show, onClose, onConfirm, title, body, confirmButtonText = "Sí, Eliminar" }) {
    const modalRef = useRef(null);

    // Control del modal con Bootstrap JS
    useEffect(() => {
        const modalEl = modalRef.current;
        if (!modalEl) return;

        const bsModal = Modal.getOrCreateInstance(modalEl);

        if (show) {
            bsModal.show();
        } else {
            bsModal.hide();
        }

        // Asegúrate de que el estado local se sincronice si el modal se cierra con la X o el fondo
        const handleHidden = () => onClose();
        modalEl.addEventListener('hidden.bs.modal', handleHidden);

        return () => {
            modalEl.removeEventListener('hidden.bs.modal', handleHidden);
        };
    }, [show, onClose]);

    // Manejar la confirmación
    const handleConfirm = () => {
        onConfirm(); // Ejecuta la acción de eliminación pasada por prop
        // onClose() se llama implícitamente por onConfirm si este cierra el estado 'show' en el padre.
    };

    if (!show) return null;

    return (
        <div 
            className="modal fade" 
            ref={modalRef} 
            tabIndex="-1" 
            aria-labelledby="deleteConfirmModalLabel" 
            aria-hidden="true"
        >
            <div className="modal-dialog modal-sm">
                <div className="modal-content">
                    <div className="modal-header bg-danger text-white">
                        <h5 className="modal-title" id="deleteConfirmModalLabel">{title || "Confirmar Eliminación"}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {body || "¿Estás seguro de que deseas realizar esta acción?"}
                        <p className="mt-3 text-danger fw-bold">Esta acción no se puede deshacer.</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
                            Cancelar
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-danger btn-sm" 
                            onClick={handleConfirm}
                        >
                            {confirmButtonText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}