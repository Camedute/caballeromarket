import React, { useEffect, useState } from "react";
import './Login.css';
import { useNavigate } from "react-router-dom";

const Loginup: React.FC = () => {
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
            setError("");
            if (role === "cliente") {
                navigate("/home");
            } else {
                navigate("/admin");
            }
        }
    };

    useEffect(() => {
        document.body.classList.add("login-background");
        return () => {
            document.body.classList.remove("login-background");
        };
    }, []);

    return (
        <div className="Login">
            <h2>CaballeroMarket</h2>

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

            <button className="btn" onClick={handleLogin}>Acceder</button>
        </div>
    );
};

export default Loginup;
