import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Productos reales con stock que necesitan
const productosReales = [
  { nombre: 'Bowl Ensalada', stock: 50 },
  { nombre: 'Panini Artesanal', stock: 60 },
  { nombre: 'Ciabata', stock: 80 },
  { nombre: 'Pan Integral', stock: 70 },
  { nombre: 'Pan de Masa Madre', stock: 45 },
  { nombre: 'Rollos de Canela', stock: 90 },
  { nombre: 'Lasagnas Caseras', stock: 30 },
  { nombre: 'Pastas Italianas', stock: 40 },
  { nombre: 'Pescados y Mariscos', stock: 25 }
];

async function actualizarStockProductos() {
  console.log('🌱 Actualizando stock de productos reales de La Fornería...\n');
  
  try {
    // Autenticarse
    console.log('🔐 Autenticando...');
    const loginRes = await axios.post(`${API_URL}/api/auth/login/`, {
      username: 'maeva',
      password: '123'
    });
    
    const token = loginRes.data.access;
    console.log(`✅ Autenticado como: maeva\n`);

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    // Obtener todos los productos
    console.log('📋 Obteniendo productos...');
    const prodResponse = await axios.get(`${API_URL}/pos/api/productos/`, config);
    const todosLosProductos = prodResponse.data.results || prodResponse.data;
    console.log(`✅ Productos encontrados: ${todosLosProductos.length}\n`);

    // Actualizar stock de productos reales
    console.log('📦 Actualizando stock...\n');
    let actualizados = 0;

    for(const stock of productosReales) {
      const producto = todosLosProductos.find(p => 
        p.nombre.toLowerCase() === stock.nombre.toLowerCase()
      );

      if(producto) {
        try {
          // Generar codigo_barra único basado en el ID
          const codigoBarraUnico = producto.codigo_barra || `FORNERIA-${producto.id}`;
          
          // Crear el objeto con todos los campos necesarios
          const productoActualizado = {
            nombre: producto.nombre,
            descripcion: producto.descripcion || '',
            marca: producto.marca || '',
            codigo_barra: codigoBarraUnico,
            precio_costo: producto.precio_costo,
            precio_venta: producto.precio_venta,
            categoria: producto.categoria,
            stock_fisico: stock.stock
          };

          const updateRes = await axios.put(
            `${API_URL}/pos/api/productos/${producto.id}/`,
            productoActualizado,
            config
          );

          console.log(`✅ ${stock.nombre}: Stock actualizado a ${stock.stock}`);
          actualizados++;
          await new Promise(r => setTimeout(r, 200));
          
        } catch(error) {
          console.error(`❌ Error actualizando ${stock.nombre}: ${JSON.stringify(error.response?.data) || error.message}`);
        }
      } else {
        console.log(`⚠️  Producto no encontrado: ${stock.nombre}`);
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMEN:');
    console.log(`   ✅ Productos actualizados: ${actualizados}`);
    console.log('='.repeat(50));
    console.log('\n✨ Stock actualizado correctamente!\n');

  } catch(error) {
    console.error('\n❌ Error en el proceso:', error.message);
  }
}

actualizarStockProductos();
