import client from "./client";

export async function login({ username, password }) {
    
    // 1. POST para obtener tokens - dj-rest-auth
    const tokenResponse = await client.post("/api/auth/login/", { username, password });
    
    const { access, refresh, user } = tokenResponse.data;
    
    // Guardar tokens inmediatamente
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);

    // 2. Guardar datos del usuario
    localStorage.setItem("user", JSON.stringify(user));

    // 3. Configurar el header de autorización para futuras llamadas
    client.defaults.headers.common['Authorization'] = `Bearer ${access}`;

    // 4. Mapear user a empleado para compatibilidad con el Navbar
    // NOTA: Esto es temporal hasta que el backend tenga endpoint /pos/me/
    
    // Verificar si es superuser o staff de múltiples formas
    const esAdmin = user.is_superuser === true || 
                    user.is_staff === true || 
                    user.username?.toLowerCase().startsWith('admin');
    
    const empleadoData = {
        nombre_completo: user.username || "Usuario",
        cargo: esAdmin ? "Administrador" : "Vendedor",
        ...user
    };
    
    console.log("=== DEBUG LOGIN ===");
    console.log("Usuario autenticado:", user);
    console.log("is_superuser:", user.is_superuser);
    console.log("is_staff:", user.is_staff);
    console.log("Es administrador:", esAdmin);
    console.log("Cargo asignado:", empleadoData.cargo);
    console.log("==================");
    
    localStorage.setItem("empleado", JSON.stringify(empleadoData));
    
    return tokenResponse.data;
}

export function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    localStorage.removeItem("empleado");
    delete client.defaults.headers.common['Authorization'];
}