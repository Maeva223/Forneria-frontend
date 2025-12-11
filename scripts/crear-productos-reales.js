import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Productos reales de La Fornería (del Landing.jsx)
const productosReales = [
  {
    nombre: 'Bowl Ensalada',
    descripcion: 'Mix de hojas frescas con aderezo especial.',
    marca: 'La Fornería',
    precio_costo: 3000,
    precio_venta: 8000,
    stock_fisico: 50
  },
  {
    nombre: 'Panini Artesanal',
    descripcion: 'Pan italiano tradicional.',
    marca: 'La Fornería',
    precio_costo: 2000,
    precio_venta: 6500,
    stock_fisico: 60
  },
  {
    nombre: 'Ciabata',
    descripcion: 'Pan rústico italiano.',
    marca: 'La Fornería',
    precio_costo: 1500,
    precio_venta: 5000,
    stock_fisico: 80
  },
  {
    nombre: 'Pan Integral',
    descripcion: 'Rico en fibra, elaborado con granos enteros y semillas.',
    marca: 'La Fornería',
    precio_costo: 1800,
    precio_venta: 5500,
    stock_fisico: 70
  },
  {
    nombre: 'Pan de Masa Madre',
    descripcion: 'Fermentación natural de 24 horas para un sabor único.',
    marca: 'La Fornería',
    precio_costo: 2200,
    precio_venta: 6800,
    stock_fisico: 45
  },
  {
    nombre: 'Rollos de Canela',
    descripcion: 'Pan dulce glaseado con azúcar de canela.',
    marca: 'La Fornería',
    precio_costo: 1200,
    precio_venta: 4500,
    stock_fisico: 90
  },
  {
    nombre: 'Lasagnas Caseras',
    descripcion: 'Lasagna casera congelada, lista para hornear.',
    marca: 'La Fornería',
    precio_costo: 3500,
    precio_venta: 10000,
    stock_fisico: 30
  },
  {
    nombre: 'Pastas Italianas',
    descripcion: 'Variedad de pastas italianas congeladas.',
    marca: 'La Fornería',
    precio_costo: 2500,
    precio_venta: 7500,
    stock_fisico: 40
  },
  {
    nombre: 'Pescados y Mariscos',
    descripcion: 'Pescados y mariscos congelados premium.',
    marca: 'La Fornería',
    precio_costo: 5000,
    precio_venta: 15000,
    stock_fisico: 25
  }
];

async function crearProductosReales() {
  console.log('🌱 Iniciando creación de productos reales de La Fornería...\n');
  
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

    // Obtener productos existentes
    console.log('📋 Obteniendo productos existentes...');
    const prodResponse = await axios.get(`${API_URL}/pos/api/productos/`, config);
    const productosExistentes = prodResponse.data.results || prodResponse.data;
    console.log(`✅ Productos existentes: ${productosExistentes.length}`);
    
    // Obtener categorías disponibles
    console.log('📂 Obteniendo categorías disponibles...');
    let categoriaId = null;
    try {
      const catResponse = await axios.get(`${API_URL}/pos/api/categorias/`, config);
      const categorias = catResponse.data.results || catResponse.data;
      if(categorias.length > 0) {
        categoriaId = categorias[0].id;
        console.log(`✅ Categoría encontrada: ${categorias[0].nombre} (ID: ${categoriaId})\n`);
      }
    } catch(e) {
      console.log('⚠️  No se pudieron obtener categorías\n');
    }

    // Crear productos reales
    console.log('📦 Creando productos reales de La Fornería...\n');
    let creados = 0;
    let existentes = 0;
    const productosCreados = [];

    for(const producto of productosReales) {
      try {
        // Verificar si ya existe
        const existe = productosExistentes.some(p => 
          p.nombre.toLowerCase() === producto.nombre.toLowerCase()
        );

        if(existe) {
          console.log(`⚠️  Producto ya existe: ${producto.nombre}`);
          existentes++;
          // Obtener el producto existente
          const prod = productosExistentes.find(p => 
            p.nombre.toLowerCase() === producto.nombre.toLowerCase()
          );
          if(prod) productosCreados.push(prod);
        } else {
          const productoData = {
            ...producto,
            categoria: categoriaId
          };
          const response = await axios.post(
            `${API_URL}/pos/api/productos/`,
            productoData,
            config
          );
          console.log(`✅ Producto creado: ${producto.nombre} - $${producto.precio_venta}`);
          productosCreados.push(response.data);
          creados++;
          await new Promise(r => setTimeout(r, 200));
        }
      } catch(error) {
        console.error(`❌ Error con ${producto.nombre}: ${JSON.stringify(error.response?.data) || error.message}`);
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMEN:');
    console.log(`   ✅ Productos creados: ${creados}`);
    console.log(`   ⚠️  Productos ya existentes: ${existentes}`);
    console.log(`   📋 Total disponibles: ${productosCreados.length}`);
    console.log('='.repeat(50));
    console.log('\n✨ ¡Productos reales de La Fornería listos!\n');

  } catch(error) {
    console.error('\n❌ Error en el proceso:', error.message);
  }
}

crearProductosReales();
