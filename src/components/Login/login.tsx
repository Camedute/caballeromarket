import React, { useEffect, useState } from "react";
import './Login.css';
import { useNavigate } from "react-router-dom";

const Loginup: React.FC = () => {
    const [username, setUsername] = useState<string>("");  // Nombre de usuario
    const [password, setPassword] = useState<string>("");  // Contraseña
    const [error, setError] = useState<string>("");        // Mensaje de error
    const [role, setRole] = useState<string>("cliente");   // Rol del usuario: cliente/admin
    const navigate = useNavigate();

    // Manejo del cambio de los campos de entrada
    const handleInputChange = <T extends HTMLInputElement>(e: React.ChangeEvent<T>, setter: React.Dispatch<React.SetStateAction<string>>) => {
        setter(e.target.value);
    };

    // Función de manejo de login
    const handleLogin = () => {
        if (username === "" || password === "") {
            setError("Por favor, complete todos los campos.");
        } else {
            setError("");
            
            // Guardar el usuario en localStorage
            const userData = {
                username: username,
                role: role
            };
            localStorage.setItem("userData", JSON.stringify(userData)); // Guardar datos de usuario

            // Redirigir según el rol
            if (role === "cliente") {
                navigate("/home");  // Redirigir a la página de cliente
            } else {
                navigate("/admin");  // Redirigir a la página de admin
            }
        }
    };

    // Cambiar el fondo del body cuando el componente está activo
    useEffect(() => {
        document.body.classList.add("login-background");
        return () => {
            document.body.classList.remove("login-background");
        };
    }, []);

    return (
        <div className="Login">
            <h2>CaballeroMarket</h2>

            {/* Selector de roles: Cliente o Admin */}
            <div className="role-tabs">
                <button
                    className={`tab ${role === "cliente" ? "active" : ""}`}
                    onClick={() => setRole("cliente")}
                >
                    Cliente
                </button>
                <button
                    className={`tab ${role === "admin" ? "active" : ""}`}
                    onClick={() => setRole("admin")}
                >
                    Admin de Negocio
                </button>
            </div>

            {/* Campo de entrada para el nombre de usuario */}
            <input
                type="text"
                className="form-control"
                placeholder="Usuario"
                value={username}
                onChange={(e) => handleInputChange(e, setUsername)}
                name="username"
                aria-label="Nombre de usuario"
            />

            {/* Campo de entrada para la contraseña */}
            <input
                type="password"
                className="form-control"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => handleInputChange(e, setPassword)}
                name="password"
                aria-label="Contraseña"
            />

            {/* Mostrar mensaje de error si hay campos vacíos */}
            {error && <p className="error-message">{error}</p>}

            {/* Botón de inicio de sesión */}
            <button className="btn" onClick={handleLogin}>Acceder</button>
        </div>
    );
};

export default Loginup;
