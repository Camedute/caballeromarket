import React, { useState, useEffect } from "react";
import './Perfil.css';
import Header from "../Header/header";
import Footer from "../Footer/footer";
import { useNavigate } from 'react-router-dom';
import db from '../../firebase/firestore';
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    try {
      // Configurar Firebase Storage
      const storage = getStorage();
      const storageRef = ref(storage, `perfiles/${uid}`);
  
      // Subir la imagen a Firebase Storage
      await uploadBytes(storageRef, file);
  
      // Obtener la URL de descarga de la imagen
      const downloadURL = await getDownloadURL(storageRef);
  
      // Actualizar la URL de la imagen en Firestore
      const userRef = isDueno ? doc(db, 'Duenos', uid) : doc(db, 'Clientes', uid);
      await updateDoc(userRef, { imagenUrl: downloadURL });
  
      // Actualizar el estado local para reflejar el cambio
      setFormData((prevData) => ({
        ...prevData,
        imagenUrl: downloadURL,
      }));
  
      console.log("Imagen subida y URL actualizada:", downloadURL);
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    }
  };
  


  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate('/');  // Redirige al inicio o login
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="perfil-container">
        <div className="perfil-imagen">
                <img src={formData.imagenUrl} alt="Perfil" />
                {isEditing && (
                  <label htmlFor="imageUpload" className="btn">
                    Subir Imagen
                    <input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
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

            <div className="perfil-dato">
              <label>Biografía:</label>
              {isEditing ? (
                <textarea
                  name="biografia"
                  value={formData.biografia || ""}
                  onChange={handleTextAreaChange}
                />
              ) : (
                <p>{formData.biografia || "Sin biografía disponible"}</p>
              )}
            </div>

            {/* Sección de estadísticas o datos adicionales */}
            {isDueno ? (
              <div className="perfil-estadisticas">
                <h3>Estadísticas del Negocio</h3>
                <div className="estadistica-item">
                  <span>Productos Vendidos:</span>
                  <p>{formData.estadisticas?.productosVendidos || 0}</p>
                </div>
              </div>
            ) : (
              <div className="perfil-estadisticas">
                <h3>Historial de Compras</h3>
                <div className="estadistica-item">
                  <span>Cantidad de pedidos completados:</span>
                  <p>{formData.estadisticas?.comprasRealizadas || 0}</p>
                </div>
              </div>
            )}

            {/* Botón Editar / Guardar */}
            {isEditing ? (
              <button className="btn" onClick={handleSaveClick}>Guardar</button>
            ) : (
              <button className="btn" onClick={handleEditClick}>Editar</button>
            )}

            {/* Botón para cerrar sesión */}
            <button className="cerrar-sesion" onClick={handleLogout}>Cerrar Sesión</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Perfil;
