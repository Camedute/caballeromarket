import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import "./finances.css";
import Footer from "../Footer/footer";
import Header from "../Header/header";
import { db, storage } from "../firebase/firestore";
import { collection, doc, getDocs, getDoc, deleteDoc, setDoc } from "@firebase/firestore";
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "../firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

interface General {
  ganancia: number;
  costo: number;
}

interface Categorias {
  categoria: string;
  cantidad: number;
}

interface pedido {
  id: string;
  idCliente: string;
  idDueno: string;
  realizado: boolean;
}

interface productoCosto {
  id: string;
  nombreProducto: string;
  cantidad: number;
  costoUnitario: number;
  costoTotal: number;
}

const Finances: React.FC = () => {
  const [uid, setUid] = useState<string>("");
  const [formDataGeneral, setFormDataGeneral] = useState<General>({ganancia: 0, costo: 0,});
  const [productosGastos, setProductosGastos] = useState<any[]>([]);
  const [formDataCategorias, setFormDataCateogias] = useState<Categorias[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("General");
  const [pedidos, setPedidos] = useState<pedido[]>([]);
  const [clientes, setClientes] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [productosFinanza, setProductosFinanza] = useState<productoCosto[]>([]);

  

  useEffect(() => {
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) {
      const { uid } = JSON.parse(storedUserData);
      if (uid) {
        setUid(uid);
        fetchData(uid);
        fetchProductos(uid);
      } else {
        console.error("UID no está definido");
      }
    } else {
      console.error("No se encontró información del usuario en localStorage");
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        fetchPedidos(user.uid);
      } else {
        setUid("");
        setPedidos([]);
      }
    });

    return () => unsubscribe();
  }, []);


  const fetchProductos = async (uid: string) => {
    if (uid) {
      const productosRef = doc(db, 'GastosEstaticos', uid);
      const productosSnap = await getDoc(productosRef);
      if(productosSnap.exists()){
        const productoFinanzaData = productosSnap.data().gastos || [];
        setProductosFinanza(productoFinanzaData);
      }
    }
  };

  const fetchData = async (uid: string) => {
    try {
      const dataRef = doc(db, "Ventas", uid);
      const dataSnap = await getDoc(dataRef);
      if (dataSnap.exists()) {
        const data = dataSnap.data();
        setFormDataGeneral({
          ganancia: data.gananciaTotal,
          costo: data.costoTotal,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPedidos = async (uid: string) => {
    setLoading(true);
    try {
      const pedidosCollection = collection(db, "Pedidos");
      const pedidosSnapshot = await getDocs(pedidosCollection);
      const pedidosList: pedido[] = pedidosSnapshot.docs.map((doc) => {
        const pedidoData = doc.data();
        return {
          id: doc.id,
          idCliente: pedidoData.idCliente,
          idDueno: pedidoData.idDueno,
          realizado: pedidoData.realizado,
        } as pedido;
      });

      // Filtrar pedidos por idDueno
      const filteredPedidos = pedidosList.filter((pedido) => pedido.idDueno === uid);
      setPedidos(filteredPedidos);

      // Cargar los clientes relacionados con los pedidos filtrados
      fetchClientes(filteredPedidos);
    } catch (error) {
      console.error("Error fetching pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientes = async (pedidosList: pedido[]) => {
    const clientesMap: { [key: string]: string } = {};

    for (const pedido of pedidosList) {
      const clienteRef = doc(db, "Clientes", pedido.idCliente);
      const clienteSnap = await getDoc(clienteRef);

      if (clienteSnap.exists()) {
        const clienteData = clienteSnap.data();
        clientesMap[pedido.idCliente] = clienteData.nombreUsuario as string;
      }
    }

    setClientes(clientesMap);
  };

  const data: Record<string, number[]> = {
    General: [formDataGeneral.ganancia, formDataGeneral.costo],
  };

  // Configuración del gráfico General
  const chartDataGeneral = {
    labels: ["Ganancia", "Costo"],
    datasets: [
      {
        data: data[selectedCategory],
        backgroundColor: ["#36eb5d", "#36a2eb"],
        hoverBackgroundColor: ["#36eb5d", "#36a2eb"],
      },
    ],
  };

  const chartOptionsGeneral = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };


  const chartOptionsBar = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  const [archivos, setArchivos] = React.useState<any[]>([]);

  const fetchArchivos = async (uid: string) => {
    if (!uid) {
      console.error("UID inválido para acceder a los documentos");
      return [];
    }
  
    const documentosRef = collection(db, `documentos/${uid}/archivos`);
    const snapshot = await getDocs(documentosRef);
    const archivos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return archivos; // [{ id, nombre, url }]
  };

  

  React.useEffect(() => {
    const cargarArchivos = async () => {
      if (uid) {
        const archivosObtenidos = await fetchArchivos(uid);
        setArchivos(archivosObtenidos);
      }
    };
    cargarArchivos();
  }, [uid]);
  

  const descargarArchivo = async (url: string) => {
    window.open(url, "_blank");
  };

  const borrarArchivo = async (id: string) => {
    console.log(`Editar nombre del archivo con id: ${id}`);
    // Lógica para editar el nombre
  };

  const eliminarArchivo = async (id: string, nombre: string) => {
    try {
      // Borrar de Firebase Storage
      const archivoRef = ref(storage, `${uid}/${nombre}`);
      await deleteObject(archivoRef);
      console.log("Archivo eliminado del Storage");

      // Borrar de Firestore
      const archivoDoc = doc(db, `documentos/${uid}/archivos`, id);
      await deleteDoc(archivoDoc);
      console.log("Archivo eliminado de Firestore");

      // Actualizar la interfaz
      setArchivos((prev) => prev.filter((archivo) => archivo.id !== id));
    } catch (error) {
      console.error("Error eliminando archivo:", error);
    }
  };

  const subirArchivo = async () => {
    const inputFile = document.createElement("input");
    inputFile.type = "file";
    inputFile.accept = ".pdf,.jpg,.png";
    inputFile.click();

    inputFile.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const archivoRef = ref(storage, `${uid}/${file.name}`);
        await uploadBytes(archivoRef, file);
        const url = await getDownloadURL(archivoRef);

        const nuevoArchivo = {
          nombre: file.name,
          url,
        };

        const archivoDoc = doc(collection(db, `documentos/${uid}/archivos`));
        await setDoc(archivoDoc, nuevoArchivo);

        setArchivos((prev) => [...prev, { id: archivoDoc.id, ...nuevoArchivo }]);
      }
    };
  };

  const renderCategoryData = () => {
    if (selectedCategory === "General") {
      return <Pie data={chartDataGeneral} options={chartOptionsGeneral} />;
    } else if (selectedCategory === "Boletas/Facturas") {

      return (
        <div className="file-manager">
          <div className="file-list">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Nombre de Archivo</th>
                  <th>Descargar</th>
                  <th>Editar</th>
                  <th>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {archivos.map((archivo) => (
                  <tr key={archivo.id}>
                    <td>{archivo.nombre}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => descargarArchivo(archivo.url)}
                      >
                        Descargar
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-warning"
                        onClick={() => borrarArchivo(archivo.id)}
                      >
                        Editar nombre documento
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => eliminarArchivo(archivo.id, archivo.nombre)}
                      >
                        Eliminar documento
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="btn btn-success" onClick={subirArchivo}>
              Subir Archivo
            </button>
          </div>
        </div>
      );
    } else if (selectedCategory === "Gastos") {
      // Lógica para "Gastos"
    } else if (selectedCategory === "Pedidos") {
      // Lógica para "Pedidos"
    }
  };

  return (
    <div className="finances-container">
      <Header />
      <div className="finances-dashboard">
        <aside className="sidebar">
          <ul className="menu-list">
            {["General", "Gastos", "Boletas/Facturas", "Pedidos"].map((category) => (
              <li
                key={category}
                className={`menu-item ${selectedCategory === category ? "active" : ""}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </aside>

        <main className="main-content">
          <div className="stats-overview">
            <h2>{selectedCategory}</h2>
            <div className="stats-graph">
              {renderCategoryData()}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Finances;
