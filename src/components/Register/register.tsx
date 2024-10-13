import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Importar autenticación de Firebase
import db from '../../firebase/firestore'; // Asegúrate de que la ruta a Firestore esté correcta
import { auth } from '../firebase/firestore';   // Asegúrate de que la ruta al auth de Firebase esté correcta
import './register.css';

const Register: React.FC = () => {
    const [nombreUsuario, setNombreUsuario] = useState<string>('');  // Nombre de usuario
    const [email, setEmail] = useState<string>('');                  // Correo electrónico
    const [password, setPassword] = useState<string>('');            // Contraseña
    const [telefono, setTelefono] = useState<string>('');            // Teléfono
    const [nombreLocal, setNombreLocal] = useState<string>('');      // Nombre del local
    const [direccion, setDireccion] = useState<string>('');          // Dirección del local
    const [error, setError] = useState<string>('');                  // Mensaje de error
    const [loading, setLoading] = useState<boolean>(false);          // Estado de carga
    const navigate = useNavigate();

    // Manejo del cambio de los campos de entrada
    const handleInputChange = <T extends HTMLInputElement>(e: React.ChangeEvent<T>, setter: React.Dispatch<React.SetStateAction<string>>) => {
        setter(e.target.value);
    };

    // Función de manejo de registro con Firebase Authentication
    const handleRegister = async () => {
        if (nombreUsuario === '' || email === '' || password === '' || telefono === '' || nombreLocal === '' || direccion === '') {
            setError('Por favor, complete todos los campos.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Registrar el usuario con Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Guardar los datos adicionales en la colección "Duenos"
            const duenosRef = collection(db, 'Duenos');
            await addDoc(duenosRef, {
                uid: user.uid,  // UID del usuario autenticado
                nombreUsuario: nombreUsuario,
                telefono: telefono,
                nombreLocal: nombreLocal,
                direccion: direccion,
                email: email
            });

            // Redirigir al usuario a la página de inicio de sesión
            navigate('/');
        } catch (err) {
            console.error('Error en el registro:', err);
            setError('Error en el registro. Intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    // Cambiar el fondo del body cuando el componente está activo
    useEffect(() => {
        document.body.classList.add('register-background');
        return () => {
            document.body.classList.remove('register-background');
        };
    }, []);

    return (
        <div className="Register">
            <h2>Registro CaballeroMarket</h2>

            {/* Campo de entrada para el nombre de usuario */}
            <input
                type="text"
                className="form-control"
                placeholder="Nombre de Usuario"
                value={nombreUsuario}
                onChange={(e) => handleInputChange(e, setNombreUsuario)}
                name="nombreUsuario"
                aria-label="Nombre de Usuario"
            />

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

            {/* Campo de entrada para el teléfono */}
            <input
                type="text"
                className="form-control"
                placeholder="Teléfono"
                value={telefono}
                onChange={(e) => handleInputChange(e, setTelefono)}
                name="telefono"
                aria-label="Teléfono"
            />

            {/* Campo de entrada para el nombre del local */}
            <input
                type="text"
                className="form-control"
                placeholder="Nombre del Local"
                value={nombreLocal}
                onChange={(e) => handleInputChange(e, setNombreLocal)}
                name="nombreLocal"
                aria-label="Nombre del Local"
            />

            {/* Campo de entrada para la dirección */}
            <input
                type="text"
                className="form-control"
                placeholder="Dirección"
                value={direccion}
                onChange={(e) => handleInputChange(e, setDireccion)}
                name="direccion"
                aria-label="Dirección"
            />

            {/* Mostrar mensaje de error si hay campos vacíos */}
            {error && <p className="error-message">{error}</p>}

            {/* Botón de registro */}
            <button className="btn" onClick={handleRegister} disabled={loading}>
                {loading ? 'Registrando...' : 'Registrarse'}
            </button>
        </div>
    );
};

export default Register;
