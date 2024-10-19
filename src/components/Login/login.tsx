import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Importar autenticación de Firebase
import { auth } from '../firebase/firestore'; // Asegúrate de que la ruta al auth de Firebase esté correcta
import './Login.css';

const Loginup: React.FC = () => {
    const [email, setEmail] = useState<string>('');        // Correo electrónico
    const [password, setPassword] = useState<string>('');  // Contraseña
    const [error, setError] = useState<string>('');        // Mensaje de error
    const [loading, setLoading] = useState<boolean>(false); // Estado de carga
    const navigate = useNavigate();

    // Manejo del cambio de los campos de entrada
    const handleInputChange = <T extends HTMLInputElement>(e: React.ChangeEvent<T>, setter: React.Dispatch<React.SetStateAction<string>>) => {
        setter(e.target.value);
    };

    // Función de manejo de login con Firebase Authentication
    const handleLogin = async () => {
        if (email === '' || password === '') {
            setError('Por favor, complete todos los campos.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Autenticar al usuario con Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Guardar solo el uid en localStorage
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
            }));

            // Aquí puedes agregar la lógica para buscar el UID en Firestore
            console.log("UID de Authentication:", user.uid); // Muestra el UID de Authentication en consola
            // Aquí puedes agregar la lógica para verificar si el usuario existe en Firestore

            // Redirigir a la página principal
            navigate('/home');
        } catch (err) {
            console.error('Error en el login:', err);
            setError('Correo o contraseña incorrectos.');
        } finally {
            setLoading(false);
        }
    };

    // Navegación al registro
    const handleRegister = () => {
        navigate('/register'); // Redirigir a la página de registro
    };

    // Cambiar el fondo del body cuando el componente está activo
    useEffect(() => {
        document.body.classList.add('login-background');
        return () => {
            document.body.classList.remove('login-background');
        };
    }, []);

    return (
        <div className="Login">
            <h2>CaballeroMarket</h2>

            {/* Campo de entrada para el correo electrónico */}
            <input
                type="email"
                className="form-control"
                placeholder="Correo Electrónico"
                value={email}
                onChange={(e) => handleInputChange(e, setEmail)}
                name="email"
                aria-label="Correo Electrónico"
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

            {/* Mostrar mensaje de error si hay algún problema */}
            {error && <p className="error-message">{error}</p>}

            {/* Mostrar spinner si está cargando */}
            {loading ? (
                <div className="loading">Cargando...</div>
            ) : (
                <div>
                    <button className="btn" onClick={handleLogin}>
                        Acceder
                    </button>
                    {/* Botón para registrarse */}
                    <button className="btn register-btn" onClick={handleRegister}>
                        Registrarse
                    </button>
                </div>
            )}
        </div>
    );
};

export default Loginup;
