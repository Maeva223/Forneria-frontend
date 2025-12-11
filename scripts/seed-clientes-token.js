// Script para poblar la base de datos con 10 clientes históricos
// USO: node scripts/seed-clientes-token.js <TU_TOKEN_AQUI>
// O simplemente copia el token del localStorage del navegador

import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Datos de 10 clientes históricos
const clientesHistoricos = [
  {
    rut: '12345678-9',
    nombre: 'Juan',
    apellido: 'Pérez González',
    email: 'juan.perez@email.com',
    telefono: '+56912345678',
    direccion: 'Av. Libertador Bernardo O\'Higgins 1234, Santiago'
  },
  {
    rut: '23456789-0',
    nombre: 'María',
    apellido: 'García Rodríguez',
    email: 'maria.garcia@email.com',
    telefono: '+56923456789',
    direccion: 'Calle Huérfanos 567, Santiago Centro'
  },
  {
    rut: '34567890-1',
    nombre: 'Carlos',
    apellido: 'López Martínez',
    email: 'carlos.lopez@email.com',
    telefono: '+56934567890',
    direccion: 'Av. Providencia 2890, Providencia'
  },
  {
    rut: '45678901-2',
    nombre: 'Ana',
    apellido: 'Fernández Silva',
    email: 'ana.fernandez@email.com',
    telefono: '+56945678901',
    direccion: 'Calle Moneda 1456, Santiago'
  },
  {
    rut: '56789012-3',
    nombre: 'Roberto',
    apellido: 'Martínez Torres',
    email: 'roberto.martinez@email.com',
    telefono: '+56956789012',
    direccion: 'Av. Las Condes 3456, Las Condes'
  },
  {
    rut: '67890123-4',
    nombre: 'Carmen',
    apellido: 'Sánchez Morales',
    email: 'carmen.sanchez@email.com',
    telefono: '+56967890123',
    direccion: 'Calle Ahumada 789, Santiago Centro'
  },
  {
    rut: '78901234-5',
    nombre: 'Pedro',
    apellido: 'Ramírez Castro',
    email: 'pedro.ramirez@email.com',
    telefono: '+56978901234',
    direccion: 'Av. Vicuña Mackenna 4567, Ñuñoa'
  },
  {
    rut: '89012345-6',
    nombre: 'Isabel',
    apellido: 'Flores Vargas',
    email: 'isabel.flores@email.com',
    telefono: '+56989012345',
    direccion: 'Calle Estado 234, Santiago'
  },
  {
    rut: '90123456-7',
    nombre: 'Diego',
    apellido: 'Morales Rojas',
    email: 'diego.morales@email.com',
    telefono: '+56990123456',
    direccion: 'Av. Apoquindo 5678, Las Condes'
  },
  {
    rut: '11223344-5',
    nombre: 'Patricia',
    apellido: 'Vega Muñoz',
    email: 'patricia.vega@email.com',
    telefono: '+56911223344',
    direccion: 'Calle Agustinas 1123, Santiago Centro'
  }
];

// Función principal
async function seedClientes() {
  console.log('🌱 Iniciando población de clientes históricos...\n');

  try {
    // Obtener token de los argumentos de línea de comandos
    const token = process.argv[2];
    
    if (!token) {
      console.error('❌ Error: No se proporcionó el token de autenticación.');
      console.log('\n💡 USO:');
      console.log('   node scripts/seed-clientes-token.js <TU_TOKEN_AQUI>');
      console.log('\n📝 Para obtener el token:');
      console.log('   1. Inicia sesión en la aplicación web');
      console.log('   2. Abre las herramientas de desarrollador (F12)');
      console.log('   3. Ve a la pestaña "Application" o "Almacenamiento"');
      console.log('   4. En "Local Storage" busca la clave "access"');
      console.log('   5. Copia el valor del token y úsalo como argumento\n');
      return;
    }

    console.log('🔐 Usando token proporcionado...\n');

    // Configurar headers con el token
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    // Crear clientes uno por uno
    let creados = 0;
    let existentes = 0;
    let errores = 0;

    for (const cliente of clientesHistoricos) {
      try {
        const response = await axios.post(
          `${API_URL}/pos/api/clientes/`,
          cliente,
          config
        );
        
        console.log(`✅ Cliente creado: ${cliente.nombre} ${cliente.apellido} (${cliente.rut})`);
        creados++;
        
        // Pequeña pausa para no saturar el servidor
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.rut) {
          console.log(`⚠️  Cliente ya existe: ${cliente.nombre} ${cliente.apellido} (${cliente.rut})`);
          existentes++;
        } else if (error.response?.status === 401) {
          console.error(`❌ Error de autenticación. El token puede haber expirado.`);
          console.log('\n💡 Obtén un nuevo token iniciando sesión en la aplicación.\n');
          return;
        } else {
          console.error(`❌ Error creando ${cliente.nombre} ${cliente.apellido}:`, 
            error.response?.data || error.message);
          errores++;
        }
      }
    }

    // Resumen
    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMEN:');
    console.log(`   ✅ Clientes creados: ${creados}`);
    console.log(`   ⚠️  Clientes existentes: ${existentes}`);
    console.log(`   ❌ Errores: ${errores}`);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('\n❌ Error en el proceso:', error.response?.data || error.message);
  }
}

// Ejecutar script
seedClientes();
