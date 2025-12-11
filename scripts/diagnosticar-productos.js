import axios from 'axios';

const API_URL = 'http://localhost:8000';

async function diagnosticarProductos() {
  try {
    const loginRes = await axios.post(`${API_URL}/api/auth/login/`, {
      username: 'maeva',
      password: '123'
    });
    
    const token = loginRes.data.access;
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const prodResponse = await axios.get(`${API_URL}/pos/api/productos/`, config);
    const todosLosProductos = prodResponse.data.results || prodResponse.data;
    
    // Buscar productos con "Pescados", "Panini", "Bowl", etc.
    const palabrasClave = ['Pescados', 'Panini', 'Bowl', 'Canela', 'Lasagna', 'Pasta', 'Ciabata', 'Pan Integral', 'Masa Madre'];
    
    console.log('🔍 Productos que coinciden con palabras clave:\n');
    
    for(const palabra of palabrasClave) {
      const coincidencias = todosLosProductos.filter(p => 
        p.nombre.toLowerCase().includes(palabra.toLowerCase())
      );
      
      if(coincidencias.length > 0) {
        console.log(`📌 ${palabra}:`);
        coincidencias.forEach(p => {
          console.log(`   - ID: ${p.id} | ${p.nombre} | Stock: ${p.stock_fisico || 0}`);
        });
      }
    }
    
  } catch(error) {
    console.error('Error:', error.message);
  }
}

diagnosticarProductos();
