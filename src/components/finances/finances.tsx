import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
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

interface productoPedido {
  cantidadProducto: number;
  categoria: string;
  idDueno: string;
  idProducto: string;
  nombreProducto: string;
  precioProducto: number;
  metodoPago: string;
  realizado: boolean;
  total: number;
}

interface pedido {
  fecha: any; // Aquí puedes ajustar esto si deseas un tipo más específico, como Date o Firebase Timestamp
  id: string;
  idCliente: string;
  idDueno: string;
  realizado: boolean;
  listaPedidos: productoPedido[];
  total: number; // Lista de productos del pedido
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
  const [formDataGeneral, setFormDataGeneral] = useState<General>({ ganancia: 0, costo: 0 });
  const [productosGastos, setProductosGastos] = useState<any[]>([]);
  const [formDataCategorias, setFormDataCateogias] = useState<Categorias[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("General");
  const [pedidos, setPedidos] = useState<pedido[]>([]);
  const [clientes, setClientes] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [productosFinanza, setProductosFinanza] = useState<productoCosto[]>([]);
  
  // Estado para el pedido seleccionado
  const [selectedPedido, setSelectedPedido] = useState<pedido | null>(null); // Estado para manejar el pedido seleccionado
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVerDetalles = (pedido: any) => {
    setSelectedPedido(pedido);
    setIsModalOpen(true); // Abre el modal al hacer clic
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Cierra el modal
  };


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
      if (productosSnap.exists()) {
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
          fecha: pedidoData.fecha?.toDate(), // Convierte el Timestamp a un objeto Date
          listaPedidos: pedidoData.listaPedidos || [],
          total: pedidoData.total,
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
        data: data[selectedCategory], // Asegúrate de que data[selectedCategory] contenga dos valores
        backgroundColor: ["#36eb5d", "#36a2eb"],
        hoverBackgroundColor: ["#36eb5d", "#36a2eb"],
      },
    ],
  };
  
  // Opciones del gráfico
  const chartOptionsGeneral = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem: any) {
            const total = tooltipItem.dataset.data.reduce((a: any, b: any) => a + b, 0); // Sumar todos los valores
            const currentValue = tooltipItem.dataset.data[tooltipItem.dataIndex]; // Valor actual
            const percentage = ((currentValue / total) * 100).toFixed(2); // Calcular porcentaje
            return `${tooltipItem.label}: ${percentage}%`; // Retornar la etiqueta y el porcentaje
          }
        }
      }
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
    }  else if (selectedCategory === "Boletas/Facturas") {
      return (
        <div className="file-manager">
          <div className="file-list">
            <table className="table table-bordered boletas-facturas-container">
              <thead>
                <tr>
                  <th>Nombre de Archivo</th>
                  <th>Descargar</th>
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
                        ⬇️
                      </button>
                    </td>
                    
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => eliminarArchivo(archivo.id, archivo.nombre)}
                      >
                        🚮
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
      return (
        <div className="file-manager">
      <div className="file-list">
        <table className="table table-bordered gastos-container">
          <thead>
            <tr>
              <th>Nombre Producto</th>
              <th>Costo Unitario</th>
              <th>Cantidad</th>
              <th>Costo Total</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {productosFinanza.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.nombreProducto}</td>
                <td>${producto.costoUnitario}</td>
                <td>{producto.cantidad} unidades</td>
                <td>${producto.costoTotal}</td>
                <td>
                  <button 
                    className="btn btn-danger">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
      );
    } else if (selectedCategory === "Pedidos") {
      return (
        <div className="file-manager">
          <div className="file-list">
            {pedidos.map((pedido, index) => (
              <div key={index} className="file-item">
                <span>Pedido {index + 1}</span>
                <button onClick={() => handleVerDetalles(pedido)} className="view-details-button">Ver detalles</button>
                <p>Cliente: {clientes[pedido.idCliente]}</p>
              </div>
            ))}
          </div>
      
          {/* Modal para mostrar los detalles del pedido */}
          {isModalOpen && selectedPedido && (
            <div className="modal-overlay">
              <div className="modal">
                <button onClick={handleCloseModal} className="close-button-finance">Salir</button>
                <div className="pedido-header">
                  <h3>Detalles del Pedido</h3>
                </div>
                <div className="pedido-body">
                  <p><strong>ID:</strong> {selectedPedido.id}</p>
                  <p><strong>Cliente:</strong> {clientes[selectedPedido.idCliente]}</p>
                  <p><strong>Fecha:</strong> {selectedPedido.fecha.toLocaleString()}</p>
                  <p><strong>Estado:</strong> {selectedPedido.realizado ? "✅ Realizado" : "⏳ Pendiente"}</p>
      
                  <h4>🛒 Productos:</h4>
                  {selectedPedido.listaPedidos && selectedPedido.listaPedidos.length > 0 ? (
                    <>
                      <ul>
                        {selectedPedido.listaPedidos.map((producto, index) => (
                          <li key={index}>
                            <p><strong>{producto.nombreProducto}</strong></p>
                            <p>Cantidad: {producto.cantidadProducto} | Precio: ${producto.precioProducto.toFixed(2)}</p>
                          </li>
                        ))}
                      </ul>
                      <p><strong>Total:</strong> ${selectedPedido.total.toFixed(2)}</p>
                    </>
                  ) : (
                    <p>No hay productos en este pedido.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      );
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
