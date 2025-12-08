// src/components/UI/Loader.jsx
export default function Loader() {
  return (
    <div className="d-flex justify-content-center align-items-center p-4">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  );
}
