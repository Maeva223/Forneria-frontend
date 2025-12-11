// Script automatizado para poblar clientes - Intenta múltiples métodos de autenticación
import axios from 'axios';
import { readFileSync } from 'fs';
import { join } from 'path';

const API_URL = 'http://localhost:8000';

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

async function obtenerToken() {
  // Intentar diferentes endpoints de autenticación
  const endpoints = [
    { url: '/pos/api/auth/login/', method: 'POST' },
    { url: '/api/token/', method: 'POST' },
    { url: '/api/auth/login/', method: 'POST' }
  ];

  const credenciales = [
    { username: 'admin', password: 'admin' },
    { username: 'admin', password: 'admin123' },
    { email: 'admin@admin.com', password: 'admin' }
  ];

  for (const endpoint of endpoints) {
    for (const cred of credenciales) {
      try {
        console.log(`🔐 Intentando autenticación en ${endpoint.url}...`);
        const response = await axios.post(`${API_URL}${endpoint.url}`, cred);
        
        // Intentar extraer el token de diferentes campos posibles
        const token = response.data.access_token || 
                     response.data.access || 
                     response.data.key ||
                     response.data.token;
        
        if (token) {
          console.log(`✅ Autenticación exitosa!`);
          return token;
        }
      } catch (error) {
        // Continuar con el siguiente intento
        continue;
      }
    }
  }

  return null;
}

async function seedClientes() {
  console.log('🌱 Iniciando población de clientes históricos...\n');

  try {
    // Primero intentar obtener token automáticamente
    let token = await obtenerToken();
    
    if (!token) {
      console.log('\n❌ No se pudo autenticar automáticamente.');
      console.log('\n📋 INSTRUCCIONES:');
      console.log('   1. Abre la aplicación en el navegador: http://localhost:5173');
      console.log('   2. Inicia sesión con tu usuario');
      console.log('   3. Abre la consola del navegador (F12)');
      console.log('   4. Copia y pega el contenido de: scripts/seed-clientes-browser.js');
      console.log('   5. Presiona Enter\n');
      
      console.log('🔄 Alternativamente, ejecuta:');
      console.log('   node scripts/seed-clientes-token.js <TU_TOKEN>\n');
      return;
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    let creados = 0;
    let existentes = 0;
    let errores = 0;

    console.log('📦 Creando clientes...\n');

    for (const cliente of clientesHistoricos) {
      try {
        await axios.post(`${API_URL}/pos/api/clientes/`, cliente, config);
        console.log(`✅ Cliente creado: ${cliente.nombre} ${cliente.apellido} (${cliente.rut})`);
        creados++;
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.rut) {
          console.log(`⚠️  Cliente ya existe: ${cliente.nombre} ${cliente.apellido} (${cliente.rut})`);
          existentes++;
        } else {
          console.error(`❌ Error creando ${cliente.nombre} ${cliente.apellido}:`, 
            error.response?.data || error.message);
          errores++;
        }
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMEN:');
    console.log(`   ✅ Clientes creados: ${creados}`);
    console.log(`   ⚠️  Clientes existentes: ${existentes}`);
    console.log(`   ❌ Errores: ${errores}`);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('\n❌ Error en el proceso:', error.message);
  }
}

seedClientes();
