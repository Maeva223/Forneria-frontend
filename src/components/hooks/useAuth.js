
import { login, logout } from "../../api/auth"; 

export function useAuth() {
    
    
    const handleLogin = async (credentials) => {
        try {
            // Llama a la función login corregida que maneja las dos peticiones y guarda en localStorage
            const data = await login(credentials);
            return data;
        } catch (error) {
            // Relanza el error para que el componente Login.jsx lo maneje
            throw error;
        }
    };

    const handleLogout = () => {
        logout(); // Llama a la función logout que limpia localStorage
    };

    return { 
        login: handleLogin, // Exportamos la función bajo el nombre 'login'
        logout: handleLogout
    }; 
}