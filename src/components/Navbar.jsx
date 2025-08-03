import './Navbar.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function Navbar({ user, rol, cartCount, onLogout, onLoginClick, onAbrirModalIA, onAbrirCarrito}) {
  
const [menuAbierto, setMenuAbierto] = useState(false);
  return (
    
    <nav className="navbar">
      <div className="navbar-left">
        
        <Link to="/">
          <img src="/logo.png" alt="Logo Tienda" className="logo-img" />
        </Link>{user && (
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
<button className="hamburger" onClick={() => setMenuAbierto(!menuAbierto)}>
  ☰
</button>
      <div className={`navbar-center ${menuAbierto ? 'mostrar' : 'ocultar'}`}>
        <Link to="/">Inicio</Link>
        <a onClick={onAbrirModalIA}>Recomendador</a>
<Link to="/creaciones">Creaciones</Link>

        {/* ✅ Añadir creación visible solo para admins */}
        {rol === 'admin' && (
          <Link to="/admin" className="admin-link">
            Añadir creación
          </Link>
        )}
        {user && (
    <>
      <span className="user mobile-only">{user.email}</span>
      <button className="logout-btn mobile-only" onClick={onLogout}>
        Cerrar sesión
      </button>
    </>
  )}

  {!user && (
    <button className="login-btn mobile-only" onClick={onLoginClick}>
      Iniciar sesión
    </button>
  )}
      </div>

      <div className="navbar-right">
        {user && (
    <a className="cart-icon" onClick={onAbrirCarrito} aria-label="Abrir carrito">
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
            <span className="user">{user.email}</span>
            <button className="logout-btn" onClick={onLogout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <button className="login-btn" onClick={onLoginClick}>
            Iniciar sesión
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
