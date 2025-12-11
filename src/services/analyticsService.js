import client from '../api/client'; 
import { endpoints } from '../api/endpoints.js'; 

// ==========================================================
// A. DASHBOARD FINANCIERO
// ==========================================================

// Finanzas - Endpoints principales
export const getResumenFinanzas = (params = {}) => 
    client.get(endpoints.analytics.resumen, { params });

export const getFinanzasKPIs = (params = {}) => 
    client.get(endpoints.analytics.kpisHoy, { params });

// Finanzas - Gráficos temporales
export const getVentasDiarias = (params = {}) =>
    client.get(endpoints.analytics.ventasDiarias, { params });

export const getVentasPorHora = (params = {}) =>
    client.get(endpoints.analytics.ventasPorHora, { params });

export const getComparativaMensual = (params = {}) =>
    client.get(endpoints.analytics.comparativaMensual, { params });

// Finanzas - Análisis de productos
export const getProductosTop = (params = {}) =>
    client.get(endpoints.analytics.productosTop, { params });

export const getVentasPorCategoria = (params = {}) =>
    client.get(endpoints.analytics.ventasPorCategoria, { params });

// Finanzas - Otros análisis
export const getVentasPorCanal = (params = {}) =>
    client.get(endpoints.analytics.ventasPorCanal, { params });

export const getClientesTop = (params = {}) =>
    client.get(endpoints.analytics.clientesTop, { params });

// Métricas avanzadas
export const getMetricasAvanzadas = (params = {}) =>
    client.get(endpoints.analytics.metricasAvanzadas, { params });

export const getTicketSegmentado = (params = {}) =>
    client.get(endpoints.analytics.ticketSegmentado, { params });

export const getVentasDiaSemana = (params = {}) =>
    client.get(endpoints.analytics.ventasDiaSemana, { params });

export const getClientesNuevosRecurrentes = (params = {}) =>
    client.get(endpoints.analytics.clientesNuevosRecurrentes, { params });

export const getHeatmapVentas = (params = {}) =>
    client.get(endpoints.analytics.heatmapVentas, { params });

export const getProyeccion = (params = {}) =>
    client.get(endpoints.analytics.proyeccion, { params });

export const getComparativaMom = (params = {}) =>
    client.get(endpoints.analytics.comparativaMom, { params });

export const getAlertasFinanzas = (params = {}) =>
    client.get(endpoints.analytics.alertas, { params });

// Análisis financiero profundo
export const getUtilidadBruta = (params = {}) =>
    client.get(endpoints.analytics.utilidadBruta, { params });

export const getGastosOperativos = (params = {}) =>
    client.get(endpoints.analytics.gastosOperativos, { params });

export const getUtilidadNeta = (params = {}) =>
    client.get(endpoints.analytics.utilidadNeta, { params });

export const getROI = (params = {}) =>
    client.get(endpoints.analytics.roi, { params });

export const getPuntoEquilibrio = (params = {}) =>
    client.get(endpoints.analytics.puntoEquilibrio, { params });

export const getProductosRentables = (params = {}) =>
    client.get(endpoints.analytics.productosRentables, { params });

export const getFlujoCaja = (params = {}) =>
    client.get(endpoints.analytics.flujoCaja, { params });

// Exportación
export const exportarExcelFinanzas = (params = {}) =>
    client.get(endpoints.analytics.exportarExcel, { params });

export const exportarCsvFinanzas = (params = {}) =>
    client.get(endpoints.analytics.exportarCsv, { params });

export const exportarPdfFinanzas = (params = {}) =>
    client.get(endpoints.analytics.exportarPdf, { params });


// ==========================================================
// B. DASHBOARD INVENTARIO
// ==========================================================

// Vista principal consolidada
export const getDashboardInventario = (params = {}) =>
    client.get(endpoints.dashboardInventario.dashboard, { params });

// KPIs y métricas generales
export const getInventarioKPIs = (params = {}) => 
    client.get(endpoints.dashboardInventario.kpisGenerales, { params });

// Alertas de stock
export const getProductosStockBajo = (params = {}) => 
    client.get(endpoints.dashboardInventario.productosStockBajo, { params });

export const getLotesVencimiento = (params = {}) => 
    client.get(endpoints.dashboardInventario.productosProximosVencer, { params });

export const getProductosVencidos = (params = {}) => 
    client.get(endpoints.dashboardInventario.productosVencidos, { params });

export const getInsumosStockBajo = (params = {}) => 
    client.get(endpoints.dashboardInventario.insumosStockBajo, { params });

// Órdenes de compra
export const getOrdenesPendientes = (params = {}) => 
    client.get(endpoints.dashboardInventario.ordenesPendientes, { params });

export const getComprasPorProveedor = (params = {}) => 
    client.get(endpoints.dashboardInventario.comprasPorProveedor, { params });

// Movimientos y análisis
export const getMovimientosInventario = (params = {}) => 
    client.get(endpoints.dashboardInventario.movimientosInventario, { params });

export const getProductosMasMovimiento = (params = {}) => 
    client.get(endpoints.dashboardInventario.productosMasMovimiento, { params });

// Distribución y valorización
export const getStockPorCategoria = (params = {}) => 
    client.get(endpoints.dashboardInventario.stockPorCategoria, { params });

export const getValorizacionPorCategoria = (params = {}) => 
    client.get(endpoints.dashboardInventario.valorizacionPorCategoria, { params });

// Rotación
export const getRotacionInventario = (params = {}) => 
    client.get(endpoints.dashboardInventario.rotacionInventario, { params });

// Alertas
export const getResumenAlertasInventario = (params = {}) => 
    client.get(endpoints.dashboardInventario.resumenAlertas, { params });

export const getAlertasActivasInventario = (params = {}) => 
    client.get(endpoints.dashboardInventario.alertasActivas, { params });


// ==========================================================
// C. FUNCIÓN CONSOLIDADA (Ejemplo)
// ==========================================================

export async function getDashboardFinanciero(params = {}) {
    try {
        // La URL consolidada es: /analytics/dashboard/finanzas/
        const url = endpoints.analytics.consolidado;
        
        // Ejecuta la llamada GET al backend pasando los parámetros
        const response = await client.get(url, { params });
        
        // Retorna el objeto de datos
        return response.data; 

    } catch (error) {
        console.error("Error al obtener el Dashboard Financiero consolidado:", error);
        throw error; 
    }
}