import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../firebase/firestore';
import './register.css';

const Register: React.FC = () => {
    const [nombreUsuario, setNombreUsuario] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [telefono, setTelefono] = useState<string>('');
    const [nombreLocal, setNombreLocal] = useState<string>('');
    const [direccion, setDireccion] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleInputChange = <T extends HTMLInputElement>(
        e: React.ChangeEvent<T>,
        setter: React.Dispatch<React.SetStateAction<string>>
    ) => {
        setter(e.target.value);
    };

    const handleBack = () => navigate('/');

    const handleRegister = async () => {
        if (nombreUsuario === '' || email === '' || password === '' || telefono === '' || nombreLocal === '' || direccion === '') {
            setError('Por favor, complete todos los campos.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const duenosRef = doc(db, 'Duenos', user.uid);
            await setDoc(duenosRef, {
                uid: user.uid,
                nombreUsuario,
                telefono,
                nombreLocal,
                direccion,
                email,
            });

            const inventarioRef = doc(db, 'Inventario', user.uid);
            await setDoc(inventarioRef, { idDueno: user.uid });

            navigate('/');
        } catch (err) {
            console.log('Error en el registro:', err);
            setError('Error en el registro. Intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.documentElement.classList.add('register-background');
        return () => {
            document.documentElement.classList.remove('register-background');
        };
    }, []);

    return (
        <div className="register-container">
            <button className="botonRegresar" onClick={handleBack}>
                Regresar
            </button>
            <h1 className="titleCaballeroMarket">CaballeroMarket</h1>
            <h2 className="subtitleCaballeroMarket">Registro</h2>

            <div className="form-grid">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre de Usuario"
                    value={nombreUsuario}
                    onChange={(e) => handleInputChange(e, setNombreUsuario)}
                />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Correo Electrónico"
                    value={email}
                    onChange={(e) => handleInputChange(e, setEmail)}
                />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => handleInputChange(e, setPassword)}
                />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Teléfono"
                    value={telefono}
                    onChange={(e) => handleInputChange(e, setTelefono)}
                />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre del Local"
                    value={nombreLocal}
                    onChange={(e) => handleInputChange(e, setNombreLocal)}
                />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Dirección"
                    value={direccion}
                    onChange={(e) => handleInputChange(e, setDireccion)}
                />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button className="btn" onClick={handleRegister} disabled={loading}>
                {loading ? 'Registrando...' : 'Registrarse'}
            </button>
        </div>
    );
};

export default Register;
