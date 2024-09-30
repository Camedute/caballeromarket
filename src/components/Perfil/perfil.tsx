import React, { useState, useEffect } from "react";
import './Perfil.css';
import Header from "../Header/header";
import Footer from "../Footer/footer";

interface UserData {
  nombre: string;
  email: string;
  Rol: string;
  telefono: string;
  imagenUrl: string;
}

const Perfil: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserData>({
    nombre: "",
    email: "",
    Rol: "",
    telefono: "",
    imagenUrl: "https://via.placeholder.com/150" // Imagen por defecto
  });

  // Obtener los datos del usuario desde localStorage
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const { username, role } = JSON.parse(storedUserData);

      // Simular datos de ejemplo en base al nombre de usuario
      setFormData({
        nombre: username,
        email: `${username.toLowerCase()}@example.com`, // Simular email
        telefono: "123456789", // Simular teléfono,
        Rol: role,
        imagenUrl: "https://via.placeholder.com/150" // Placeholder para la imagen de perfil
      });
    }
  }, []);

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
              <label>Rol:</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.Rol}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{formData.Rol}</p>
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
