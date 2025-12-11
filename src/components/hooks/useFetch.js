import { useEffect, useState } from "react";
import client from "../api/client"; // Importa el cliente CON interceptores

export function useFetch(url, params = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      setLoading(true);
      try {
        // Al usar client, el token se va solo
        const res = await client.get(url, { params });
        if (mounted) setData(res.data);
      } catch (err) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchData();
    return () => { mounted = false; };
  }, [url, JSON.stringify(params)]); // Truco: stringify params para detectar cambios en filtros

  return { data, loading, error };
}