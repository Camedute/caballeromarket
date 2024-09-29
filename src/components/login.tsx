import React, { useEffect, useState } from "react";
import './styles/Login.css';
import { useNavigate } from "react-router-dom";
import { Auth, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firestore";
import { initializeApp } from "firebase/app";

function Loginup() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [role, setRole] = useState<string>("cliente");
    const navigate = useNavigate();

    //JORDAN, SI VES ESTO, ES PARTE DE LA AUTENTICACIÓN DEL USUARIO, ES EL MANSO ATAO XDDDDDDDDDDDDDD
    /*
    const [currentUser, setCurrentUser] = useState(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, initializeUser);
        return unsubscribe;
    }, [])

    async function initializeUser(user){
        if (user){
            setCurrentUser({ ...user });
            setUserLoggedIn(true);
        } else{
            setCurrentUser(null);
            setUserLoggedIn(false);
        }
        setLoading(false);
    }
    
    const value = {
        currentUser,
        userLoggedIn,
        loading
    }
*/
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

    useEffect(() => {
        // Agregar la clase de fondo solo cuando estás en la página de login
        document.body.classList.add("login-background");
        return () => {
            // Quitar la clase de fondo cuando sales de la página de login
            document.body.classList.remove("login-background");
        };
    }, []);

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
