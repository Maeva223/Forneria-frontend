import client from "./client";

export async function login({ username, password }) {
    
    // 1. POST para obtener tokens
    const tokenResponse = await client.post("/api/auth/login/", { username, password });
    
    const { access, refresh, user } = tokenResponse.data;
    
    // Guardar tokens inmediatamente
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);

    // 2. GET para obtener datos del empleado con cargo
    // Configurar el header de autorización temporalmente para esta llamada
    client.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    
    // Llama al endpoint de perfil
    const employeeResponse = await client.get("/pos/me/");
    
    const employeeData = employeeResponse.data;

    // 3. Guardar el objeto COMPLETO del empleado bajo la clave 'empleado'
    localStorage.setItem("empleado", JSON.stringify(employeeData)); 
    
    // Guardar el objeto 'user' original (opcional)
    localStorage.setItem("user", JSON.stringify(user));

    // Limpiar el header por defecto después de usarlo
    delete client.defaults.headers.common['Authorization'];

    return { ...tokenResponse.data, empleado: employeeData };
}

export function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    // Asegúrate de limpiar también la clave 'empleado'
    localStorage.removeItem("empleado"); 
}