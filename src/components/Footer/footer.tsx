import React from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom"; // Importamos Link para la navegación interna
import './footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer_content">
        <div className="footer_section about">
          <h3>Caballero Market</h3>
          <p>Tu mejor mercado en línea. Encuentra productos de calidad a los mejores precios.</p>
        </div>
        <div className="footer_section social">
          <h3>Síguenos</h3>
          <ul>
            <li><a href="https://facebook.com" aria-label="Facebook"><FaFacebook /></a></li>
            <li><a href="https://twitter.com" aria-label="Twitter"><FaTwitter /></a></li>
            <li><a href="https://instagram.com" aria-label="Instagram"><FaInstagram /></a></li>
          </ul>
        </div>
        <div className="footer_section links">
          <h3>Enlaces Rápidos</h3>
          <ul>
            <li><Link to="/home">Inicio</Link></li>
            <li><Link to="/perfil">Perfil</Link></li>
            <li><Link to="/inventario">Inventario</Link></li>
            <li><Link to="/carrito">Pedidos</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer_bottom">
        <p>&copy; {new Date().getFullYear()} Caballero Market - Todos los derechos reservados</p>
      </div>
    </footer>
  );
};

export default Footer;
