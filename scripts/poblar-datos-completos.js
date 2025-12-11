import axios from 'axios';

const API_URL = 'http://localhost:8000';

// 10 clientes históricos
const clientes = [
  {rut:'12345678-9',nombre:'Juan',apellido:'Pérez González',email:'juan.perez@email.com',telefono:'+56912345678',direccion:'Los Arrayanes 1234, La Serena'},
  {rut:'23456789-0',nombre:'María',apellido:'García Rodríguez',email:'maria.garcia@email.com',telefono:'+56923456789',direccion:'Av. Francisco de Aguirre 567, La Serena'},
  {rut:'34567890-1',nombre:'Carlos',apellido:'López Martínez',email:'carlos.lopez@email.com',telefono:'+56934567890',direccion:'Av. del Mar 2890, La Serena'},
  {rut:'45678901-2',nombre:'Ana',apellido:'Fernández Silva',email:'ana.fernandez@email.com',telefono:'+56945678901',direccion:'Calle Balmaceda 1456, La Serena'},
  {rut:'56789012-3',nombre:'Roberto',apellido:'Martínez Torres',email:'roberto.martinez@email.com',telefono:'+56956789012',direccion:'Peñuelas 3456, La Serena'},
  {rut:'67890123-4',nombre:'Carmen',apellido:'Sánchez Morales',email:'carmen.sanchez@email.com',telefono:'+56967890123',direccion:'Los Carrera 789, La Serena'},
  {rut:'78901234-5',nombre:'Pedro',apellido:'Ramírez Castro',email:'pedro.ramirez@email.com',telefono:'+56978901234',direccion:'Matta 4567, La Serena'},
  {rut:'89012345-6',nombre:'Isabel',apellido:'Flores Vargas',email:'isabel.flores@email.com',telefono:'+56989012345',direccion:'Infante 234, La Serena'},
  {rut:'90123456-7',nombre:'Diego',apellido:'Morales Rojas',email:'diego.morales@email.com',telefono:'+56990123456',direccion:'Av. Cisternas 5678, La Serena'},
  {rut:'11223344-5',nombre:'Patricia',apellido:'Vega Muñoz',email:'patricia.vega@email.com',telefono:'+56911223344',direccion:'Av. Cuatro Esquinas 1123, La Serena'}
];

// Productos reales de La Fornería (extraídos del Landing.jsx)
const productosReales = [
  'Bowl Ensalada',
  'Panini Artesanal',
  'Ciabata',
  'Pan Integral',
  'Pan de Masa Madre',
  'Rollos de Canela',
  'Lasagnas Caseras',
  'Pastas Italianas',
  'Pescados y Mariscos'
];

async function poblarDatos() {
  console.log('🌱 Iniciando población de datos históricos...\n');
  
  try {
    // 1. Autenticarse
    console.log('🔐 Autenticando...');
    const loginRes = await axios.post(`${API_URL}/api/auth/login/`, {
      username: 'admin',
      password: 'admin123'
    });
    
    const token = loginRes.data.access;
    console.log(`✅ Autenticado como: maeva\n`);

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    // 2. Insertar clientes
    console.log('\n📦 Insertando clientes...\n');
    let creados = 0;
    let existentes = 0;
    const clientesCreados = [];
    
    for(const cliente of clientes) {
      try {
        const response = await axios.post(`${API_URL}/pos/api/clientes/`, cliente, config);
        console.log(`✅ Cliente creado: ${cliente.nombre} ${cliente.apellido} (${cliente.rut})`);
        clientesCreados.push(response.data);
        creados++;
        await new Promise(r => setTimeout(r, 200));
      } catch(error) {
        if(error.response?.status === 400) {
          console.log(`⚠️  Cliente ya existe: ${cliente.nombre} ${cliente.apellido} (${cliente.rut})`);
          // Intentar obtener el cliente existente
          try {
            const existing = await axios.get(`${API_URL}/pos/api/clientes/${cliente.rut}/`, config);
            clientesCreados.push(existing.data);
            existentes++;
          } catch(e) {
            console.log(`  ℹ️  No se pudo recuperar cliente existente`);
          }
        } else {
          console.log(`❌ Error con ${cliente.nombre}: ${JSON.stringify(error.response?.data) || error.message}`);
        }
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMEN CLIENTES:');
    console.log(`   ✅ Clientes nuevos: ${creados}`);
    console.log(`   ⚠️  Clientes ya existentes: ${existentes}`);
    console.log(`   📋 Total disponibles: ${clientesCreados.length}`);
    console.log('='.repeat(50));

    // 3. Obtener productos del inventario
    console.log('\n🔍 Obteniendo productos del inventario...\n');
    let productosDisponibles = [];
    let productosRealesEncontrados = [];
    
    try {
      const prodResponse = await axios.get(`${API_URL}/pos/api/productos/`, config);
      const todosLosProductos = prodResponse.data.results || prodResponse.data;
      console.log(`✅ Total de productos en inventario: ${todosLosProductos.length}\n`);
      
      // Mostrar primeros productos para debugging
      console.log('📋 Productos disponibles en inventario:');
      todosLosProductos.slice(0, 10).forEach((p, i) => {
        console.log(`   ${i+1}. ${p.nombre} (Stock: ${p.stock_fisico || 0})`);
      });
      if(todosLosProductos.length > 10) console.log(`   ... y ${todosLosProductos.length - 10} más\n`);
      
      // Filtrar productos reales de La Fornería (los que creamos)
      const productosRealesCreados = todosLosProductos.filter(p => {
        const nombreProducto = (p.nombre || '').toLowerCase();
        return productosReales.some(real => nombreProducto.includes(real.toLowerCase()));
      });
      
      if(productosRealesCreados.length > 0) {
        console.log(`✅ Productos reales de La Fornería encontrados: ${productosRealesCreados.length}`);
        productosDisponibles = productosRealesCreados;
      } else {
        console.log('⚠️  No se encontraron productos reales de La Fornería');
        console.log('   Necesitas ejecutar primero: node scripts/crear-productos-reales.js\n');
        return;
      }
      
      if(productosDisponibles.length === 0) {
        console.log('\n⚠️  No hay productos en el inventario.');
        return;
      }
      
    } catch(error) {
      console.error('❌ Error al obtener productos:', error.response?.data || error.message);
      return;
    }

    // 4. Crear ventas históricas
    console.log('\n💰 Generando ventas históricas...\n');
    
    let ventasCreadas = 0;
    const fechasBase = [
      '2024-11-15', '2024-11-20', '2024-11-25', '2024-12-01',
      '2024-12-05', '2024-12-08', '2024-12-10', '2024-12-12',
      '2024-12-15', '2024-12-18'
    ];

    for(let i = 0; i < Math.min(clientesCreados.length, 10); i++) {
      const cliente = clientesCreados[i];
      const fecha = fechasBase[i] || '2024-12-20';
      
      // Seleccionar 2-4 productos aleatorios
      const numProductos = Math.floor(Math.random() * 3) + 2; // 2-4 productos
      const productosVenta = [];
      let totalVenta = 0;
      
      for(let j = 0; j < numProductos; j++) {
        const producto = productosDisponibles[Math.floor(Math.random() * productosDisponibles.length)];
        const cantidad = Math.floor(Math.random() * 3) + 1; // 1-3 unidades
        const precioUnitario = producto.precio_venta || producto.precio || 5000;
        
        productosVenta.push({
          producto_id: producto.id,
          cantidad: cantidad,
          precio_unitario: precioUnitario.toString()
        });
        
        totalVenta += precioUnitario * cantidad;
      }

      try {
        const ventaData = {
          cliente_id: cliente.id,
          canal: 'pos',
          items: productosVenta,
          pagos: [{
            metodo: ['EFE', 'TAR', 'TRA'][Math.floor(Math.random() * 3)],
            monto: totalVenta.toString(),
            monto_recibido: totalVenta.toString()
          }]
        };

        const ventaResponse = await axios.post(`${API_URL}/pos/api/ventas/`, ventaData, config);
        console.log(`✅ Venta creada para ${cliente.nombre} ${cliente.apellido} - ${productosVenta.length} productos - $${totalVenta.toLocaleString()}`);
        ventasCreadas++;
        await new Promise(r => setTimeout(r, 300));
        
      } catch(error) {
        console.log(`❌ Error creando venta para ${cliente.nombre}: ${JSON.stringify(error.response?.data) || error.message}`);
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMEN FINAL:');
    console.log(`   👥 Clientes: ${clientesCreados.length}`);
    console.log(`   📦 Productos en inventario: ${productosDisponibles.length}`);
    console.log(`   💰 Ventas históricas creadas: ${ventasCreadas}`);
    console.log('='.repeat(50));
    console.log('\n✨ ¡Proceso completado!\n');
    
  } catch(error) {
    console.error('\n❌ Error en el proceso:', error.message);
  }
}

poblarDatos();
