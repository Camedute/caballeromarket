import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firestore';
import './Login.css';

const Loginup: React.FC = () => {
    const [email, setEmail] = useState<string>('');        
    const [password, setPassword] = useState<string>('');  
    const [error, setError] = useState<string>('');        
    const [loading, setLoading] = useState<boolean>(false); 
    const navigate = useNavigate();

    const handleInputChange = <T extends HTMLInputElement>(
        e: React.ChangeEvent<T>,
        setter: React.Dispatch<React.SetStateAction<string>>
    ) => {
        setter(e.target.value);
    };

    const handleLogin = async () => {
        if (email === '' || password === '') {
            setError('Por favor, complete todos los campos.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            localStorage.setItem('user', JSON.stringify({ uid: user.uid }));
            navigate('/home');
        } catch (err) {
            console.error('Error en el login:', err);
            setError('Correo o contraseña incorrectos.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = () => {
        navigate('/register');
    };

    const handleResetPassword = () => {
        navigate('/reset-password');
    };

    useEffect(() => {
        document.body.classList.add('login-background');
        return () => {
            document.body.classList.remove('login-background');
        };
    }, []);

    return (
        <div className="main-container">
            {/* Contenedor del formulario de inicio de sesión */}
            <div className="login-container">
                {/* Contenedor del título */}
                <div className="title-container">
                    <h2>CaballeroMarket</h2>
                </div>

                {/* Contenedor del formulario */}
                <div className="form-container">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Correo Electrónico✉️"
                        value={email}
                        onChange={(e) => handleInputChange(e, setEmail)}
                        name="email"
                        aria-label="Correo Electrónico"
                    />
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Contraseña🙊"
                        value={password}
                        onChange={(e) => handleInputChange(e, setPassword)}
                        name="password"
                        aria-label="Contraseña"
                    />
                    <button className="button-link" onClick={handleResetPassword}>
                        ¿No te acuerdas de la contraseña? Restablecer aquí!
                    </button>
                    {error && <p className="error-message">{error}</p>}
                </div>

                {/* Contenedor de los botones */}
                <div className="button-container">
                    <button className="button-57" role="button" onClick={handleLogin}>
                        <span className="text">🚪</span>
                        <span>Ingresar</span>
                    </button>
                    <button className="button-57" role="button" onClick={handleRegister}>
                        <span className="text">✍️</span>
                        <span>Registrarse</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Loginup;
