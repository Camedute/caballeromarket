import React, { useState, useEffect } from "react";
import './Perfil.css';
import Header from "../Header/header";
import Footer from "../Footer/footer";
import db from '../../firebase/firestore';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

interface UserData {
  nombreUsuario: string;
  correoUsuario: string;
  telefono?: string;
  nombreLocal?: string;
  direccion?: string;
  imagenUrl: string;
}

const Perfil: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserData>({
    nombreUsuario: "",
    correoUsuario: "",
    telefono: "",
    nombreLocal: "",
    direccion: "",
    imagenUrl: "https://via.placeholder.com/150" // Imagen por defecto
  });

  const [isDueno, setIsDueno] = useState<boolean>(false);
  const [uid, setUid] = useState<string>("");

  useEffect(() => {
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) {
      const { uid } = JSON.parse(storedUserData);

      if (uid) {
        setUid(uid);
        fetchUserData(uid);
      } else {
        console.error("UID no está definido");
      }
    } else {
      console.error("No se encontró información del usuario en localStorage");
    }
  }, []);

  const fetchUserData = async (uid: string) => {
    try {
      console.log("UID del login:", uid); // Muestra el UID del login

      // Primero intentamos obtener datos del dueño
      const duenoRef = doc(db, 'Duenos', uid);
      const duenoSnap = await getDoc(duenoRef);
      if (duenoSnap.exists()) {
        const duenoData = duenoSnap.data();
        console.log("UID de Firebase (dueño):", uid); // Muestra el UID de Firebase
        setIsDueno(true);
        setFormData({
          nombreUsuario: duenoData.nombreUsuario,
          correoUsuario: duenoData.email,
          telefono: duenoData.telefono,
          nombreLocal: duenoData.nombreLocal,
          direccion: duenoData.direccion,
          imagenUrl: "https://via.placeholder.com/150"
        });
        return; // Salimos si encontramos datos de dueño
      }

      // Si no existe, buscamos datos del cliente
      const clienteRef = doc(db, 'Clientes', uid);
      const clienteSnap = await getDoc(clienteRef);
      if (clienteSnap.exists()) {
        const clienteData = clienteSnap.data();
        console.log("UID de Firebase (cliente):", uid); // Muestra el UID de Firebase
        setFormData({
          nombreUsuario: clienteData.nombreUsuario,
          correoUsuario: clienteData.correoUsuario,
          imagenUrl: "https://via.placeholder.com/150"
        });
      } else {
        console.error("Documento de cliente no encontrado");
      }
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveClick = async () => {
    setIsEditing(false);

    try {
      if (isDueno) {
        const duenoRef = doc(db, 'Duenos', uid);
        await updateDoc(duenoRef, {
          nombreUsuario: formData.nombreUsuario,
          email: formData.correoUsuario,
          telefono: formData.telefono,
          nombreLocal: formData.nombreLocal,
          direccion: formData.direccion,
        });
      } else {
        const clienteRef = doc(db, 'Clientes', uid);
        await updateDoc(clienteRef, {
          nombreUsuario: formData.nombreUsuario,
          correoUsuario: formData.correoUsuario,
        });
      }
      console.log("Datos guardados:", formData);
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
    }
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
                  name="nombreUsuario"
                  value={formData.nombreUsuario}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{formData.nombreUsuario}</p>
              )}
            </div>

            <div className="perfil-dato">
              <label>Email:</label>
              {isEditing ? (
                <input
                  type="email"
                  name="correoUsuario"
                  value={formData.correoUsuario}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{formData.correoUsuario}</p>
              )}
            </div>

            {isDueno && (
              <>
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

                <div className="perfil-dato">
                  <label>Nombre del Local:</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="nombreLocal"
                      value={formData.nombreLocal}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p>{formData.nombreLocal}</p>
                  )}
                </div>

                <div className="perfil-dato">
                  <label>Dirección:</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p>{formData.direccion}</p>
                  )}
                </div>
              </>
            )}

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
