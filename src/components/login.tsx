import React, { useState } from "react";
import './styles/Login.css';
import { useNavigate } from "react-router-dom";

function Loginup() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [role, setRole] = useState<string>("cliente");
    const navigate = useNavigate();

    const handleInputChange = <T extends HTMLInputElement>(e: React.ChangeEvent<T>, setter: React.Dispatch<React.SetStateAction<string>>) => {
        setter(e.target.value);
    };

    const handleLogin = () => {
        if (username === "" || password === "") {
            setError("Por favor, complete todos los campos.");
        } else {
            setError(""); // Limpiar error si los campos están completos
            // Aquí podrías manejar la autenticación real
            if (role === "cliente") {
                navigate("/home");
            } else {
                navigate("/admin");
            }
        }
    };

    return (
        <div className="Login">
            <h2>CaballeroMarket</h2>
            <input
                type="text"
                className="form-control"
                placeholder="Usuario"
                value={username}
                onChange={(e) => handleInputChange(e, setUsername)}
                name="username"
                aria-label="Nombre de usuario"
            />
            <input
                type="password"
                className="form-control"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => handleInputChange(e, setPassword)}
                name="password"
                aria-label="Contraseña"
            />
            {error && <p className="error-message">{error}</p>}
            
            <div className="role-selector">
                <label>
                    <input
                        type="radio"
                        value="cliente"
                        checked={role === "cliente"}
                        onChange={() => setRole("cliente")}
                    />
                    Cliente
                </label>
                <label>
                    <input
                        type="radio"
                        value="admin"
                        checked={role === "admin"}
                        onChange={() => setRole("admin")}
                    />
                    Admin de Negocio
                </label>
            </div>

            <button className="btn" onClick={handleLogin}>Acceder</button>
        </div>
    );
}

export default Loginup;
