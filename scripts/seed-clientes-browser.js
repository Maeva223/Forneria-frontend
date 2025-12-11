// Script para poblar clientes históricos desde la consola del navegador
// Copia y pega este código completo en la consola de desarrollador (F12)
// mientras estás en la aplicación web con sesión iniciada

(async function poblarClientes() {
  const API_URL = 'http://localhost:8000';
  const token = localStorage.getItem('access');

  if (!token) {
    console.error('❌ No se encontró el token. Asegúrate de haber iniciado sesión.');
    return;
  }

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

  console.log('🌱 Iniciando población de clientes históricos...\n');

  let creados = 0;
  let existentes = 0;
  let errores = 0;

  for (const cliente of clientesHistoricos) {
    try {
      const response = await fetch(`${API_URL}/pos/api/clientes/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
      });

      if (response.ok) {
        console.log(`✅ Cliente creado: ${cliente.nombre} ${cliente.apellido} (${cliente.rut})`);
        creados++;
      } else if (response.status === 400) {
        const data = await response.json();
        if (data.rut) {
          console.log(`⚠️  Cliente ya existe: ${cliente.nombre} ${cliente.apellido} (${cliente.rut})`);
          existentes++;
        } else {
          console.error(`❌ Error creando ${cliente.nombre}:`, data);
          errores++;
        }
      } else {
        console.error(`❌ Error ${response.status} creando ${cliente.nombre} ${cliente.apellido}`);
        errores++;
      }

      // Pequeña pausa
      await new Promise(resolve => setTimeout(resolve, 200));

    } catch (error) {
      console.error(`❌ Error creando ${cliente.nombre} ${cliente.apellido}:`, error);
      errores++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 RESUMEN:');
  console.log(`   ✅ Clientes creados: ${creados}`);
  console.log(`   ⚠️  Clientes existentes: ${existentes}`);
  console.log(`   ❌ Errores: ${errores}`);
  console.log('='.repeat(50));
})();
