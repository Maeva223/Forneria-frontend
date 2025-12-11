import axios from 'axios';

const API_URL = 'http://localhost:8000';

const clientes = [
  {rut:'76543210-9',nombre:'Café',apellido:'Bella Vista',email:'contacto@bellavista.cl',telefono:'+56951234567',direccion:'Los Arrayanes 1234, La Serena'},
  {rut:'76543211-7',nombre:'Restaurant',apellido:'El Buen Sabor',email:'ventas@buensabor.cl',telefono:'+56951234568',direccion:'Av. Francisco de Aguirre 567, La Serena'},
  {rut:'76543212-5',nombre:'Panadería',apellido:'Artesanal Don Luis',email:'info@donluis.cl',telefono:'+56951234569',direccion:'Calle Balmaceda 890, La Serena'},
  {rut:'76543213-3',nombre:'Cafetería',apellido:'La Italiana',email:'contacto@laitaliana.cl',telefono:'+56951234570',direccion:'Av. del Mar 2345, La Serena'},
  {rut:'76543214-1',nombre:'Restaurant',apellido:'Mare Nostrum',email:'pedidos@marenostrum.cl',telefono:'+56951234571',direccion:'Peñuelas 456, La Serena'},
  {rut:'76543215-K',nombre:'Hotel',apellido:'Plaza La Serena',email:'compras@hotelplaza.cl',telefono:'+56951234572',direccion:'Los Carrera 300, La Serena'},
  {rut:'76543216-8',nombre:'Cafetería',apellido:'Dulce Aroma',email:'info@dulcearoma.cl',telefono:'+56951234573',direccion:'Matta 789, La Serena'},
  {rut:'76543217-6',nombre:'Restaurant',apellido:'La Casona Gourmet',email:'reservas@casona.cl',telefono:'+56951234574',direccion:'Av. Cuatro Esquinas 1500, La Serena'},
  {rut:'76543218-4',nombre:'Deli',apellido:'Sabores del Valle',email:'contacto@saboresvalle.cl',telefono:'+56951234575',direccion:'Infante 234, La Serena'},
  {rut:'76543219-2',nombre:'Bistró',apellido:'Mediterranean',email:'pedidos@mediterranean.cl',telefono:'+56951234576',direccion:'Av. Cisternas 678, La Serena'}
];

async function insertarClientes() {
  console.log('🌱 Iniciando inserción de clientes...\n');
  
  try {
    // Intentar autenticarse con diferentes combinaciones
    console.log('🔐 Autenticando...');
    
    const credenciales = [
      { username: 'maeva', password: '123' },
      { username: 'mari', password: 'inacap123' }
    ];
    
    let token = null;
    
    for(const cred of credenciales) {
      try {
        console.log(`Intentando con: ${cred.username}...`);
        const loginRes = await axios.post(`${API_URL}/api/auth/login/`, cred);
        token = loginRes.data.access;
        if(token) {
          console.log(`✅ Autenticado como: ${cred.username}\n`);
          break;
        }
      } catch(e) {
        console.log(`  ❌ ${JSON.stringify(e.response?.data) || e.message}`);
        // Continuar con la siguiente credencial
      }
    }
    
    if(!token) {
      console.error('❌ No se pudo autenticar con ninguna credencial');
      return;
    }
    
    // Insertar clientes
    let creados = 0;
    let existentes = 0;
    let errores = 0;
    
    for(const cliente of clientes) {
      try {
        await axios.post(`${API_URL}/pos/api/clientes/`, cliente, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log(`✅ Cliente creado: ${cliente.nombre} ${cliente.apellido} (${cliente.rut})`);
        creados++;
        await new Promise(r => setTimeout(r, 200));
      } catch(error) {
        if(error.response?.status === 400) {
          console.log(`⚠️  Cliente ya existe: ${cliente.nombre} ${cliente.apellido} (${cliente.rut})`);
          existentes++;
        } else {
          console.log(`❌ Error con ${cliente.nombre}: ${error.response?.data || error.message}`);
          errores++;
        }
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMEN:');
    console.log(`   ✅ Clientes creados: ${creados}`);
    console.log(`   ⚠️  Clientes ya existentes: ${existentes}`);
    console.log(`   ❌ Errores: ${errores}`);
    console.log('='.repeat(50));
    
  } catch(error) {
    console.error('\n❌ Error:', error.response?.data || error.message);
  }
}

insertarClientes();
