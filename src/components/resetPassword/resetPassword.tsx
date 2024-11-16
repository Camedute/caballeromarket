import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/firestore'; // Asegúrate de que la ruta al auth de Firebase esté correcta
import { useNavigate } from 'react-router-dom';
import './resetPassword.css';

const ResetPassword: React.FC = () => {
    const [email, setEmail] = useState<string>('');       
    const [error, setError] = useState<string>('');       
    const [success, setSuccess] = useState<string>('');    
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleResetPassword = async () => {
        if (email === '') {
            setError('Por favor, ingresa tu correo electrónico.');
            return;
        }

        setError('');
        setSuccess('');

        try {
            await sendPasswordResetEmail(auth, email);
            setSuccess('¡Se ha enviado un enlace de restablecimiento de contraseña a tu correo electrónico!');
        } catch (err) {
            console.error('Error al enviar el correo:', err);
            setError('No se pudo enviar el correo. Asegúrate de que el correo esté registrado.');
        }
    };

    const handleBackToLogin = () => {
        navigate('/');
    };

    return (
        <div className="reset-password">
            <h2>Restablecer Contraseña</h2>
            <input
                type="email"
                className="form-control"
                placeholder="Correo Electrónico✉️"
                value={email}
                onChange={handleInputChange}
                name="email"
                aria-label="Correo Electrónico"
            />
            <button className="button-57" onClick={handleResetPassword}>
                Restablecer Contraseña
            </button>

            {/* Mostrar mensajes de error o éxito */}
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <button className="button-link" onClick={handleBackToLogin}>
                Volver a Iniciar Sesión
            </button>
        </div>
    );
};

export default ResetPassword;