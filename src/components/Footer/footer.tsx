import React from "react";
import './footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer_content">
        <div className="footer_section about">
          <h3>Caballero Market</h3>
          <p>Tu mejor mercado en línea. Encuentra productos de calidad a los mejores precios.</p>
        </div>
        <div className="footer_section links">
          <h3>Enlaces Rápidos</h3>
          <ul>
            <li><a href="/about">Sobre Nosotros</a></li>
            <li><a href="/contact">Contacto</a></li>
            <li><a href="/privacy">Política de Privacidad</a></li>
            <li><a href="/terms">Términos de Servicio</a></li>
          </ul>
        </div>
        <div className="footer_section social">
          <h3>Síguenos</h3>
          <ul>
            <li><a href="https://facebook.com">Facebook</a></li>
            <li><a href="https://twitter.com">Twitter</a></li>
            <li><a href="https://instagram.com">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="footer_bottom">
        <p>&copy; {new Date().getFullYear()} Caballero Market - Todos los derechos reservados</p>
      </div>
    </footer>
  );
}

export default Footer;
