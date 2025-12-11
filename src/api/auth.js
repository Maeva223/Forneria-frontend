import client from "./client";

export async function login({ username, password }) {
    try {
        // 1. POST para obtener tokens
        console.log("Intentando login con:", username);
        const tokenResponse = await client.post("/api/auth/login/", { username, password });
        console.log("Token response:", tokenResponse.data);
        
        const { access, refresh, user } = tokenResponse.data;
        
        // Guardar tokens inmediatamente
        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);

        // 2. GET para obtener datos del empleado con cargo
        try {
            console.log("Obteniendo datos del empleado...");
            // Crear una nueva instancia de cliente con el token
            const employeeResponse = await client.get("/pos/me/", {
                headers: {
                    'Authorization': `Bearer ${access}`
                }
            });
            
            const employeeData = employeeResponse.data;
            console.log("Datos del empleado:", employeeData);

            // 3. Guardar el objeto COMPLETO del empleado bajo la clave 'empleado'
            localStorage.setItem("empleado", JSON.stringify(employeeData)); 
            
            // Guardar el objeto 'user' original (opcional)
            localStorage.setItem("user", JSON.stringify(user));

            return { ...tokenResponse.data, empleado: employeeData };
        } catch (err) {
            // Si falla obtener el empleado, usar los datos que tenemos
            console.warn("No se pudo obtener datos del empleado:", err.response?.data || err.message);
            localStorage.setItem("user", JSON.stringify(user));
            return { ...tokenResponse.data, empleado: user };
        }
    } catch (error) {
        console.error("Error en login:", error.response?.data || error.message);
        throw error;
    }
}

export function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    // Asegúrate de limpiar también la clave 'empleado'
    localStorage.removeItem("empleado"); 
}