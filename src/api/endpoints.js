// Endpoints de la API del backend Forneria
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const endpoints = {
  // === AUTH ===
  auth: {
    login: '/api/auth/login/',
    logout: '/api/auth/logout/',
    tokenRefresh: '/api/auth/token/refresh/',
    currentUser: '/api/user/',
  },

  // === ANALYTICS / DASHBOARD FINANCIERO ===
  analytics: {
    // Finanzas - Endpoints principales
    resumen: '/analytics/finanzas/resumen/',
    kpisHoy: '/analytics/finanzas/kpis-hoy/',

    // Finanzas - Gráficos temporales
    ventasDiarias: '/analytics/finanzas/ventas-diarias/',
    ventasPorHora: '/analytics/finanzas/ventas-por-hora/',
    comparativaMensual: '/analytics/finanzas/comparativa-mensual/',

    // Finanzas - Análisis de productos
    productosTop: '/analytics/finanzas/productos-top/',
    ventasPorCategoria: '/analytics/finanzas/ventas-por-categoria/',

    // Finanzas - Otros análisis
    ventasPorCanal: '/analytics/finanzas/ventas-por-canal/',
    clientesTop: '/analytics/finanzas/clientes-top/',

    // Métricas avanzadas
    metricasAvanzadas: '/analytics/finanzas/metricas-avanzadas/',
    ticketSegmentado: '/analytics/finanzas/ticket-segmentado/',
    ventasDiaSemana: '/analytics/finanzas/ventas-dia-semana/',
    clientesNuevosRecurrentes: '/analytics/finanzas/clientes-nuevos-recurrentes/',
    heatmapVentas: '/analytics/finanzas/heatmap-ventas/',
    proyeccion: '/analytics/finanzas/proyeccion/',
    comparativaMom: '/analytics/finanzas/mom/',
    alertas: '/analytics/finanzas/alertas/',

    // Análisis financiero profundo
    utilidadBruta: '/analytics/finanzas/utilidad-bruta/',
    gastosOperativos: '/analytics/finanzas/gastos-operativos/',
    utilidadNeta: '/analytics/finanzas/utilidad-neta/',
    roi: '/analytics/finanzas/roi/',
    puntoEquilibrio: '/analytics/finanzas/punto-equilibrio/',
    productosRentables: '/analytics/finanzas/productos-rentables/',
    flujoCaja: '/analytics/finanzas/flujo-caja/',

    // Exportación
    exportarExcel: '/analytics/finanzas/exportar/excel/',
    exportarCsv: '/analytics/finanzas/exportar/csv/',
    exportarPdf: '/analytics/finanzas/exportar/pdf/',
  },

  // === DASHBOARD INVENTARIO ===
  dashboardInventario: {
    // Vista principal consolidada
    dashboard: '/dashboard/inventario/',

    // KPIs y métricas generales
    kpisGenerales: '/inventario/kpis-generales/',

    // Alertas de stock
    productosStockBajo: '/inventario/productos-stock-bajo/',
    productosProximosVencer: '/inventario/productos-proximos-vencer/',
    productosVencidos: '/inventario/productos-vencidos/',
    insumosStockBajo: '/inventario/insumos-stock-bajo/',

    // Órdenes de compra
    ordenesPendientes: '/inventario/ordenes-pendientes/',
    comprasPorProveedor: '/inventario/compras-por-proveedor/',

    // Movimientos y análisis
    movimientosInventario: '/inventario/movimientos/',
    productosMasMovimiento: '/inventario/productos-mas-movimiento/',

    // Distribución y valorización
    stockPorCategoria: '/inventario/stock-por-categoria/',
    valorizacionPorCategoria: '/inventario/valorizacion-por-categoria/',

    // Rotación
    rotacionInventario: '/inventario/rotacion/',

    // Alertas
    resumenAlertas: '/inventario/alertas/resumen/',
    alertasActivas: '/inventario/alertas/activas/',
  },

  // === POS / VENTAS ===
  ventas: {
    list: '/pos/api/ventas/',
    detail: (id) => `/pos/api/ventas/${id}/`,
    create: '/pos/api/ventas/',
    dashboard: '/pos/api/dashboard/',
  },

  // === PRODUCTOS / INVENTARIO ===
  productos: {
    list: '/pos/api/productos/',
    detail: (id) => `/pos/api/productos/${id}/`,
    create: '/pos/api/productos/',
    update: (id) => `/pos/api/productos/${id}/`,
    delete: (id) => `/pos/api/productos/${id}/`,
  },

  // === CLIENTES ===
  clientes: {
    list: '/pos/api/clientes/',
    detail: (rut) => `/pos/api/clientes/${rut}/`,
    create: '/pos/api/clientes/',
    update: (id) => `/pos/api/clientes/${id}/`,
    delete: (id) => `/pos/api/clientes/${id}/`,
  },

  // === CATEGORÍAS ===
  categorias: {
    list: '/pos/api/categorias/',
    detail: (id) => `/pos/api/categorias/${id}/`,
  },

  // === LOTES ===
  lotes: {
    list: '/pos/api/lotes/',
    detail: (id) => `/pos/api/lotes/${id}/`,
    create: '/pos/api/lotes/',
    update: (id) => `/pos/api/lotes/${id}/`,
    delete: (id) => `/pos/api/lotes/${id}/`,
    byProduct: (productId) => `/pos/api/productos/${productId}/lotes/`,
  },

  // === PEDIDOS ===
  pedidos: {
    list: '/pedidos/',
    detail: (id) => `/pedidos/${id}/`,
    activos: '/pedidos/activos/',
  },

  // === INVENTARIO (lista simple) ===
  inventario: {
    list: '/inventario/',
  },

  // === EMPLEADOS ===
  empleados: {
    list: '/pos/api/empleados/',
    detail: (id) => `/pos/api/empleados/${id}/`,
  },

  // === MOVIMIENTOS INVENTARIO ===
  movimientos: {
    list: '/pos/api/movimientos-inventario/',
  },
};

export default endpoints;
