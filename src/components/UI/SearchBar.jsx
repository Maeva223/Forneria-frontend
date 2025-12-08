// src/components/UI/SearchBar.jsx
import { useState } from "react";

export default function SearchBar({ placeholder = "Buscar...", onSearch }) {
  const [query, setQuery] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(query);
  }

  return (
    <form onSubmit={handleSubmit} className="d-flex mb-3">
      <input
        type="text"
        className="form-control me-2"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="btn btn-primary">Buscar</button>
    </form>
  );
}
