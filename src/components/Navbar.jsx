import './Navbar.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function Navbar({ user, rol, cartCount, onLogout, onLoginClick, onAbrirModalIA, onAbrirCarrito}) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleLinkClick = () => {
    setMenuAbierto(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" >
          <img src="/logo.png" alt="Logo Tienda" className="logo-img" />
        </Link>
        {user && (
          <a className="cart-icon mobile-cart mobile-only" onClick={onAbrirCarrito} aria-label="Abrir carrito">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              width="26"
              height="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 10 C28 4, 36 4, 44 10" fill="#c2a07d" />
              <path d="M16 20 Q32 0, 48 20 L52 56 Q32 64, 12 56 Z" fill="#d7bfa7" stroke="#7b4f35"/>
              <path d="M20 18 C28 12, 36 12, 44 18" stroke="#7b4f35" />
              <line x1="28" y1="18" x2="28" y2="32" stroke="#7b4f35" />
              <line x1="36" y1="18" x2="36" y2="32" stroke="#7b4f35" />
            </svg>
            <span className="cart-count">{cartCount}</span>
          </a>
        )}
      </div>

      {/* Hamburger button - only visible on mobile */}
      <button className="hamburger" onClick={() => setMenuAbierto(!menuAbierto)}>
        ☰
      </button>

      {/* Mobile menu - only visible when hamburger is clicked */}
      <div className={`navbar-center ${menuAbierto ? 'mostrar' : 'ocultar'}`}>
        <Link to="/" onClick={handleLinkClick}>Inicio</Link>
        <Link to="/creaciones" onClick={handleLinkClick}>Creaciones</Link>

        {/* Admin link - visible only for admins */}
        {rol === 'admin' && (
          <Link to="/admin" className="admin-link" onClick={handleLinkClick}>
            Añadir creación
          </Link>
        )}

        {/* Mobile-only user section */}
        <div className="mobile-user-section">
          {user ? (
            <>
              <span className="user mobile-user">{user.email}</span>
              <button className="glass-btn mobile-logout" onClick={() => { handleLinkClick(); onLogout(); }}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <button className="glass-btn mobile-login" onClick={() => { handleLinkClick(); onLoginClick(); }}>
              Iniciar sesión
            </button>
          )}
        </div>
      </div>

      {/* Desktop navigation - hidden on mobile */}
      <div className="navbar-right">
        {user && (
          <a className="cart-icon desktop-cart" onClick={onAbrirCarrito} aria-label="Abrir carrito">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              width="26"
              height="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 10 C28 4, 36 4, 44 10" fill="#c2a07d" />
              <path d="M16 20 Q32 0, 48 20 L52 56 Q32 64, 12 56 Z" fill="#d7bfa7" stroke="#7b4f35"/>
              <path d="M20 18 C28 12, 36 12, 44 18" stroke="#7b4f35" />
              <line x1="28" y1="18" x2="28" y2="32" stroke="#7b4f35" />
              <line x1="36" y1="18" x2="36" y2="32" stroke="#7b4f35" />
            </svg>
            <span className="cart-count">{cartCount}</span>
          </a>
        )}
        
        {user ? (
          <>
            <span className="user desktop-user">{user.email}</span>
            <button className="glass-btn desktop-logout" onClick={onLogout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <button className="glass-btn desktop-login" onClick={onLoginClick}>
            Iniciar sesión
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;