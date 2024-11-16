import React, { useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import "./finances.css";
import Footer from "../Footer/footer";
import Header from "../Header/header";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Finances: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("General");

  const data: Record<string, number[]> = {
    General: [30, 70],
    Productos: [100, 50, 20, 60, 90, 30, 10, 40, 80, 70],
    Categorías: [40, 25, 35, 70, 60, 80, 10, 50, 30, 90],
    Gastos: [60, 30, 10, 20, 50, 30, 40, 10],
    "Boletas/Facturas": [7, 3, 5, 2],
    Pedidos: [8, 5, 9, 4],
  };

  const chartDataGeneral = {
    labels: ["Ganancia", "Costo"],
    datasets: [
      {
        data: data[selectedCategory],
        backgroundColor: ["#36a2eb", "#ffcd56"],
        hoverBackgroundColor: ["#36a2eb", "#ffcd56"],
      },
    ],
  };

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

  const renderCategoryData = () => {
    if (selectedCategory === "General") {
      return <Pie data={chartDataGeneral} options={{ responsive: true, maintainAspectRatio: false }} />;
    } else if (selectedCategory === "Productos" || selectedCategory === "Categorías") {
      return <Bar data={chartDataBar} />;
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
        {/* Menú lateral */}
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

        {/* Contenido principal */}
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
