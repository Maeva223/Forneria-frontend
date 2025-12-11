import client from "./client";

export async function login({ username, password }) {
  // El interceptor NO inyectará token aquí porque aún no existe en localStorage
  const response = await client.post("/api/auth/login/", { username, password });
  
  const { access, refresh, user } = response.data;

  // Guardamos en LocalStorage
  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
  localStorage.setItem("user", JSON.stringify(user));

  // Obtenemos datos del empleado (ahora SÍ funcionará el interceptor porque ya guardamos el access)
  const employeeResponse = await client.get("/pos/me/");
  const employeeData = employeeResponse.data;
  
  localStorage.setItem("empleado", JSON.stringify(employeeData)); 

  return { ...response.data, empleado: employeeData };
}

export function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
  localStorage.removeItem("empleado");
  // Opcional: Redirigir al login
}