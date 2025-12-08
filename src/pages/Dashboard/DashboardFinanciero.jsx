import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import client from "../../api/client";
import Loader from "../../components/UI/Loader";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function DashboardFinanciero() {
  const [kpis, setKpis] = useState(null);
  const [dias, setDias] = useState([]);
  const [meses, setMeses] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    setLoading(true);
    try {
      const { data } = await client.get("/dashboard/ventas/");
      setKpis(data.kpis);
      setDias(data.dias);
      setMeses(data.meses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const diasData = {
    labels: dias.map((d) => d.dia),
    datasets: [
      {
        label: "Total diario (CLP)",
        data: dias.map((d) => d.total),
        borderColor: "#2d6cdf",
        backgroundColor: "rgba(45,108,223,0.08)",
        tension: 0.2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const mesesData = {
    labels: meses.map((m) => m.mes),
    datasets: [
      {
        label: "Total mensual (CLP)",
        data: meses.map((m) => m.total),
        backgroundColor: "#2d6cdf",
      },
    ],
  };

  return (
    <div className="container py-4">
      <h2>Dashboard de Ventas</h2>
      <p>Totales por día (últimos 60 días) y por mes</p>

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* KPI cards */}
          <div
            className="kpi-container d-flex flex-wrap gap-3 mb-4"
            style={{ marginBottom: "1.4rem" }}
          >
            <Link to="/ventas" className="kpi-card text-decoration-none">
              <div className="kpi-title">Ingresos (30d)</div>
              <div className="kpi-value">
                ${parseInt(kpis.total_ingresos_30).toLocaleString("es-CL")}
              </div>
              <div className="kpi-sub">Ventas: {kpis.total_ventas_30}</div>
            </Link>

            <Link to="/ventas" className="kpi-card text-decoration-none">
              <div className="kpi-title">Ventas hoy</div>
              <div className="kpi-value">{kpis.ventas_hoy}</div>
              <div className="kpi-sub">
                Promedio (30d): $
                {parseInt(kpis.promedio_venta_30).toLocaleString("es-CL")}
              </div>
            </Link>

            <Link to="/inventario" className="kpi-card text-decoration-none">
              <div className="kpi-title">Inventario</div>
              <div className="kpi-value">Ver productos</div>
              <div className="kpi-sub">Ir a inventario</div>
            </Link>

            <Link to="/clientes" className="kpi-card text-decoration-none">
              <div className="kpi-title">Clientes</div>
              <div className="kpi-value">Ver clientes</div>
              <div className="kpi-sub">Ir a clientes</div>
            </Link>
          </div>

          {/* Gráfico por días */}
          <div style={{ maxWidth: "900px", marginBottom: "2rem" }}>
            <Line data={diasData} options={{ responsive: true }} height={120} />
          </div>

          {/* Gráfico por meses */}
          <div style={{ maxWidth: "900px", marginBottom: "2rem" }}>
            <Bar data={mesesData} options={{ responsive: true }} height={80} />
          </div>

          <p>Fuente: datos del modelo Venta</p>
        </>
      )}
    </div>
  );
}
