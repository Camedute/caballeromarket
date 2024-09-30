import React, { useState } from "react";
import './Perfil.css';
import Header from "../Header/header";
import Footer from "../Footer/footer";

interface PerfilProps {
  nombre: string;
  email: string;
  telefono: string;
  imagenUrl: string;
}

const Perfil: React.FC<PerfilProps> = ({ nombre, email, telefono, imagenUrl }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    nombre,
    email,
    telefono,
    imagenUrl,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    // Aquí podrías enviar los datos actualizados al servidor o a un estado global.
    console.log("Datos guardados:", formData);
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="perfil-container">
          <div className="perfil-imagen">
            <img src={formData.imagenUrl} alt="Perfil" />
          </div>
          <div className="perfil-datos">
            <div className="perfil-dato">
              <label>Nombre:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{formData.nombre}</p>
              )}
            </div>

            <div className="perfil-dato">
              <label>Email:</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{formData.email}</p>
              )}
            </div>

            <div className="perfil-dato">
              <label>Teléfono:</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{formData.telefono}</p>
              )}
            </div>

            {isEditing ? (
              <button className="btn" onClick={handleSaveClick}>Guardar</button>
            ) : (
              <button className="btn" onClick={handleEditClick}>Editar</button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Perfil;
