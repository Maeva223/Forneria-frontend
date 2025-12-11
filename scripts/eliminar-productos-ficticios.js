import axios from "axios";

const API_URL = "http://localhost:8000";

// Productos reales de la landing que deben conservarse
const landingProducts = new Set([
  "Bowl Ensalada",
  "Panini Artesanal",
  "Ciabata",
  "Pan Integral",
  "Pan de Masa Madre",
  "Rollos de Canela",
  "Lasagnas Caseras",
  "Pastas Italianas",
  "Pescados y Mariscos",
]);

async function main() {
  console.log("🔐 Autenticando...");
  const loginRes = await axios.post(`${API_URL}/api/auth/login/`, {
    username: "maeva",
    password: "123",
  });
  const token = loginRes.data.access;
  const auth = { headers: { Authorization: `Bearer ${token}` } };

  console.log("📋 Obteniendo productos...");
  const prodRes = await axios.get(`${API_URL}/pos/api/productos/`, auth);
  const productos = Array.isArray(prodRes.data)
    ? prodRes.data
    : prodRes.data.results || [];

  console.log(`Total productos: ${productos.length}`);

  const borrar = productos.filter((p) => !landingProducts.has(p.nombre));
  const conservar = productos.filter((p) => landingProducts.has(p.nombre));

  console.log(`✅ Conservar: ${conservar.length}`);
  conservar.forEach((p) =>
    console.log(`   - ID ${p.id} | ${p.nombre} | stock ${p.stock_fisico}`)
  );

  console.log(`\n🗑️  Borrar: ${borrar.length}`);
  for (const p of borrar) {
    try {
      await axios.delete(`${API_URL}/pos/api/productos/${p.id}/`, auth);
      console.log(`   ✅ Eliminado ID ${p.id} | ${p.nombre}`);
    } catch (err) {
      const status = err.response?.status;
      const rawData = err.response?.data || err.message;
      const data =
        typeof rawData === "string" ? `${rawData.slice(0, 200)}...` : rawData;
      console.error(
        `   ❌ No se pudo eliminar ID ${p.id} | ${p.nombre} | status ${status}:`,
        data
      );
    }
  }

  console.log("\n✨ Proceso terminado");
}

main().catch((e) => {
  const rawData = e.response?.data || e.message;
  const data = typeof rawData === "string" ? `${rawData.slice(0, 200)}...` : rawData;
  console.error("Error general:", data);
});
