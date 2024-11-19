import React, { useState, useEffect } from "react";
import './Perfil.css';
import Header from "../Header/header";
import Footer from "../Footer/footer";
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/firestore';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface UserData {
  nombreUsuario: string;
  correoUsuario: string;
  telefono?: string;
  nombreLocal?: string;
  direccion?: string;
  imagenUrl: string;
  biografia?: string;
  estadisticas?: { productosVendidos?: number; comprasRealizadas?: number };
}

const Perfil: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserData>({
    nombreUsuario: "",
    correoUsuario: "",
    telefono: "",
    nombreLocal: "",
    direccion: "",
    imagenUrl: "https://via.placeholder.com/150",
    biografia: "",
    estadisticas: { productosVendidos: 0, comprasRealizadas: 0 }
  });
  const [isDueno, setIsDueno] = useState<boolean>(false);
  const [uid, setUid] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('perfil-page');
    return () => {
      document.body.classList.remove('perfil-page');
    };
  }, []);

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
      const duenoRef = doc(db, 'Duenos', uid);
      const duenoSnap = await getDoc(duenoRef);
      if (duenoSnap.exists()) {
        const duenoData = duenoSnap.data();
        setIsDueno(true);
        setFormData({
          nombreUsuario: duenoData.nombreUsuario,
          correoUsuario: duenoData.email,
          telefono: duenoData.telefono,
          nombreLocal: duenoData.nombreLocal,
          direccion: duenoData.direccion,
          imagenUrl: duenoData.imagenUrl || "https://via.placeholder.com/150",
          biografia: duenoData.biografia || "",
          estadisticas: { productosVendidos: duenoData.productosVendidos || 0 }
        });
        return;
      }

      const clienteRef = doc(db, 'Clientes', uid);
      const clienteSnap = await getDoc(clienteRef);
      if (clienteSnap.exists()) {
        const clienteData = clienteSnap.data();
        setFormData({
          nombreUsuario: clienteData.nombreUsuario,
          correoUsuario: clienteData.correoUsuario,
          imagenUrl: clienteData.imagenUrl || "https://via.placeholder.com/150",
          biografia: clienteData.biografia || "",
          estadisticas: { comprasRealizadas: clienteData.comprasRealizadas || 0 }
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

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    setIsEditing(false);
    try {
      const userRef = isDueno ? doc(db, 'Duenos', uid) : doc(db, 'Clientes', uid);
      await updateDoc(userRef, { ...formData });
      console.log("Datos guardados:", formData);
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
    }
  };

  const handleImageUploadClick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const storage = getStorage();
      const storageRef = ref(storage, `imagenesPerfil/${uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData({ ...formData, imagenUrl: url });
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate('/');
  };

  return (
    <div className="perfil-page">
      <Header />
      <div className="perfil-container">
        <button
          className={`cerrar-sesion ${isEditing ? 'hidden' : ''}`}
          onClick={handleLogout}
        >
          Cerrar Sesión
        </button>
        <div className="perfil-imagen">
          <img src={formData.imagenUrl} alt="Imagen de perfil" />
        </div>
        <div className="editar-foto">
          {isEditing && (
            <>
              <label htmlFor="image-upload" className="upload-button">
                Subir Foto
              </label>
              <input
                type="file"
                id="image-upload"
                onChange={handleImageUploadClick}
                style={{ display: 'none' }}  // Ocultamos el input
              />
            </>
          )}
        </div>
        <div className="perfil-dato">
          <label>Nombre de usuario</label>
          <input
            type="text"
            name="nombreUsuario"
            value={formData.nombreUsuario}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
        <div className="perfil-dato">
          <label>Correo electrónico</label>
          <input
            type="email"
            name="correoUsuario"
            value={formData.correoUsuario}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
        {isDueno && (
          <>
            <div className="perfil-dato">
              <label>Nombre del local</label>
              <input
                type="text"
                name="nombreLocal"
                value={formData.nombreLocal}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="perfil-dato">
              <label>Dirección</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </>
        )}
        <div className="perfil-dato">
          <label>Biografía</label>
          <textarea
            name="biografia"
            value={formData.biografia || ""}
            onChange={handleTextAreaChange}
            disabled={!isEditing}
          />
        </div>
        <div className="perfil-botones">
          {isEditing ? (
            <button className="guardar-perfil" onClick={handleSaveClick}>Guardar</button>
          ) : (
            <button className="editar-perfil" onClick={handleEditClick}>Modificar</button>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Perfil;
