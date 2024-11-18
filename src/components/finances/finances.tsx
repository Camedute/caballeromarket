import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import "./finances.css";
import Footer from "../Footer/footer";
import Header from "../Header/header";
import { db } from "../firebase/firestore";
import { doc, getDoc } from "@firebase/firestore";

// Registramos los elementos de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

interface general {
  ganancia: number;
  costo: number;
}

const Finances: React.FC = () => {
  const [uid, setUid] = useState<string>("");
  const [formDataGeneral, setFormDataGeneral] = useState<general>({
    ganancia: 0,
    costo: 0,
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("General");

  useEffect(() => {
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) {
      const { uid } = JSON.parse(storedUserData);
      if (uid) {
        setUid(uid);
        fetchData(uid);
      } else {
        console.error("UID no está definido");
      }
    } else {
      console.error("No se encontró información del usuario en localStorage");
    }
  }, []);

  const fetchData = async (uid: string) => {
    try {
      const dataRef = doc(db, 'Ventas', uid);
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

  const data: Record<string, number[]> = {
    General: [formDataGeneral.ganancia, formDataGeneral.costo],
    Productos: [100, 50, 20, 60, 90, 30, 10, 40, 80, 70],
    Categorías: [40, 25, 35, 70, 60, 80, 10, 50, 30, 90],
    Gastos: [60, 30, 10, 20, 50, 30, 40, 10],
    "Boletas/Facturas": [7, 3, 5, 2],
    Pedidos: [8, 5, 9, 4],
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

  // Configuración del gráfico de barras
  const chartDataBar = {
    labels: Array.from({ length: 10 }, (_, i) => `Elemento ${i + 1}`),
    datasets: [
      {
        label: selectedCategory === "Productos" ? "Productos" : "Categorías",
        data: data[selectedCategory].slice(0, 10),
        backgroundColor: "#36a2eb",
        borderColor: "#36a2eb",
        borderWidth: 1,
      },
    ],
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

  const renderCategoryData = () => {
    if (selectedCategory === "General") {
      return <Pie data={chartDataGeneral} options={chartOptionsGeneral} />;
    } else if (selectedCategory === "Productos" || selectedCategory === "Categorías") {
      return <Bar data={chartDataBar} options={chartOptionsBar} />;
    } else if (selectedCategory === "Gastos") {
      return (
        <div className="excel-style-table">
          <table>
            <thead>
              <tr>
                <th>Elemento</th>
                <th>Valor</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {data[selectedCategory]?.map((value, index) => (
                <tr key={index}>
                  <td>{`Elemento ${index + 1}`}</td>
                  <td>{value}</td>
                  <td>
                    <button>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (selectedCategory === "Boletas/Facturas" || selectedCategory === "Pedidos") {
      return (
        <div className="file-manager">
          <div className="file-list">
            {data[selectedCategory]?.map((file, index) => (
              <div key={index} className="file-item">
                <span>Archivo {index + 1}</span>
                <button>Eliminar</button>
              </div>
            ))}
          </div>
          <button className="upload-button">Subir Archivo</button>
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
            {["General", "Productos", "Categorías", "Gastos", "Boletas/Facturas", "Pedidos"].map((category) => (
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
