import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
        <div className="main-containerLogin">
            {/* Contenedor del formulario de inicio de sesión */}
            <div className="login-container">
                {/* Contenedor del título */}
                <div className="title-containerLogin">
                    <h2>CaballeroMarket</h2>
                </div>
    
                {/* Contenedor del formulario */}
                <div className="form-containerLogin">
                    <input
                        type="email"
                        className="form-controlLogin"
                        placeholder="Correo Electrónico✉️"
                        value={email}
                        onChange={(e) => handleInputChange(e, setEmail)}
                        name="email"
                        aria-label="Correo Electrónico"
                    />
                    <input
                        type="password"
                        className="form-controlLogin"
                        placeholder="Contraseña🙊"
                        value={password}
                        onChange={(e) => handleInputChange(e, setPassword)}
                        name="password"
                        aria-label="Contraseña"
                    />
                    <Link to="/reset-password">¿No te acuerdas de tu contraseña? Restablecela acá!</Link>
                    {error && <p className="error-messageLogin">{error}</p>}
                </div>
    
                {/* Contenedor de los botones */}
                <div className="button-containerLogin">
                    <button className="button-57Login" role="button" onClick={handleLogin}>
                        <span className="text">🚪</span>
                        <span>Ingresar</span>
                    </button>
                    <button className="button-57Login" role="button" onClick={handleRegister}>
                        <span className="text">✍️</span>
                        <span>Registrarse</span>
                    </button>
                </div>
            </div>
        </div>
    );
    
};

export default Loginup;
