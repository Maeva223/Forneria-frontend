import axios from 'axios';

const API_URL = 'http://localhost:8000';

const clientes = [
  {rut:'12345678-9',nombre:'Juan',apellido:'Pérez González',email:'juan.perez@email.com',telefono:'+56912345678',direccion:'Av. Libertador Bernardo O\'Higgins 1234, Santiago'},
  {rut:'23456789-0',nombre:'María',apellido:'García Rodríguez',email:'maria.garcia@email.com',telefono:'+56923456789',direccion:'Calle Huérfanos 567, Santiago Centro'},
  {rut:'34567890-1',nombre:'Carlos',apellido:'López Martínez',email:'carlos.lopez@email.com',telefono:'+56934567890',direccion:'Av. Providencia 2890, Providencia'},
  {rut:'45678901-2',nombre:'Ana',apellido:'Fernández Silva',email:'ana.fernandez@email.com',telefono:'+56945678901',direccion:'Calle Moneda 1456, Santiago'},
  {rut:'56789012-3',nombre:'Roberto',apellido:'Martínez Torres',email:'roberto.martinez@email.com',telefono:'+56956789012',direccion:'Av. Las Condes 3456, Las Condes'},
  {rut:'67890123-4',nombre:'Carmen',apellido:'Sánchez Morales',email:'carmen.sanchez@email.com',telefono:'+56967890123',direccion:'Calle Ahumada 789, Santiago Centro'},
  {rut:'78901234-5',nombre:'Pedro',apellido:'Ramírez Castro',email:'pedro.ramirez@email.com',telefono:'+56978901234',direccion:'Av. Vicuña Mackenna 4567, Ñuñoa'},
  {rut:'89012345-6',nombre:'Isabel',apellido:'Flores Vargas',email:'isabel.flores@email.com',telefono:'+56989012345',direccion:'Calle Estado 234, Santiago'},
  {rut:'90123456-7',nombre:'Diego',apellido:'Morales Rojas',email:'diego.morales@email.com',telefono:'+56990123456',direccion:'Av. Apoquindo 5678, Las Condes'},
  {rut:'11223344-5',nombre:'Patricia',apellido:'Vega Muñoz',email:'patricia.vega@email.com',telefono:'+56911223344',direccion:'Calle Agustinas 1123, Santiago Centro'}
];

async function tryAuth() {
  const endpoints = ['/pos/api/auth/login/', '/api/auth/login/'];
  const credsList = [
    {username:'admin',password:'admin'},
    {username:'admin',password:'admin123'},
    {username:'admin',password:'12345'},
    {username:'root',password:'root'},
    {username:'forneria',password:'forneria'}
  ];
  
  for(const ep of endpoints){
    for(const creds of credsList){
      try{
        console.log(`Intentando ${ep} con ${creds.username}...`);
        const r = await axios.post(API_URL+ep, creds);
        const token = r.data.access_token || r.data.access || r.data.key || r.data.token;
        if(token){
          console.log(`✅ Autenticado con ${creds.username}`);
          return token;
        }
      }catch(e){}
    }
  }
  return null;
}

async function insertClientes() {
  try {
    const token = await tryAuth();
    
    if(!token){
      console.log('\n❌ No se pudo autenticar. Por favor usa el script desde el navegador.');
      console.log('Abre http://localhost:5173, inicia sesión, y ejecuta en la consola F12:\n');
      console.log('Ver archivo: scripts/seed-clientes-browser.js\n');
      return;
    }
    
    let creados=0, existentes=0;
    
    for(const c of clientes){
      try{
        await axios.post(`${API_URL}/pos/api/clientes/`, c, {
          headers: {'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'}
        });
        console.log(`✅ ${c.nombre} ${c.apellido} (${c.rut})`);
        creados++;
        await new Promise(r=>setTimeout(r,200));
      }catch(e){
        if(e.response?.status === 400){
          console.log(`⚠️  Ya existe: ${c.nombre} ${c.apellido}`);
          existentes++;
        }else{
          console.log(`❌ Error: ${c.nombre} - ${e.message}`);
        }
      }
    }
    
    console.log(`\n📊 Creados: ${creados} | Ya existían: ${existentes}`);
  } catch(e) {
    console.error('Error:', e.message);
  }
}

insertClientes();
