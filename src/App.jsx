import { useState, useEffect } from 'react';
import './index.css';
import { supabase } from './supabaseClient';
import AdminProductForm from './components/AdminProductForm';
import Auth from './components/Auth';
import Navbar from './components/Navbar';
import RecomendadorIA from './components/RecomendadorIA';
import ProductList from './components/ProductList';
import ModalRecomendador from './components/ModalRecomendador';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ProductDetail from './components/ProductDetail';
import CartModal from './components/CartModal';
import CartNotification from './components/CartNotification';
import Creaciones from './components/Creaciones';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
  const storedCart = localStorage.getItem('carrito');
  return storedCart ? JSON.parse(storedCart) : [];
});
  const [user, setUser] = useState(null);
  const [rol, setRol] = useState(null);
  const [productoAñadido, setProductoAñadido] = useState(null);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mostrarIA, setMostrarIA] = useState(false);
  const [mostrarModalIA, setMostrarModalIA] = useState(false);
const [mostrarCarrito, setMostrarCarrito] = useState(false);
const total = cart.reduce((acc, item) => acc + item.precio, 0).toFixed(2);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        setUser(user);
        const { data, error } = await supabase
          .from('perfiles')
          .select('rol')
          .eq('id', user.id)
          .single();

        if (data) {
          setRol(data.rol);
        }
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        supabase
          .from('perfiles')
          .select('rol')
          .eq('id', currentUser.id)
          .single()
          .then(({ data }) => setRol(data?.rol));
      } else {
        setRol(null);
      }
    });

    fetchProducts();
    const storedCart = localStorage.getItem('carrito');
if (storedCart) {
  setCart(JSON.parse(storedCart));
}
  }, []);
  useEffect(() => {
  localStorage.setItem('carrito', JSON.stringify(cart));
}, [cart]);


  const fetchProducts = async () => {
    const { data, error } = await supabase.from('productos').select('*');
    if (!error) setProducts(data);
  };

  const addToCart = (product) => {
  const exists = cart.find((item) => item.id === product.id);
  if (!exists) {
    setCart([...cart, product]);
    setProductoAñadido(product);
     
  }
};


  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };




  return (
  <div className="app">
    <Router>
      <ScrollToTop />

      <Navbar
        user={user}
        rol={rol}
        cartCount={cart.length}
        onLogout={() => {
  supabase.auth.signOut();
  setCart([]);
  localStorage.removeItem('carrito');
}}
        onLoginClick={() => setShowAuthModal(true)}
        onAbrirModalIA={() => setMostrarModalIA(true)} 
        onAbrirCarrito={() => setMostrarCarrito(true)}

      />

      <Routes>
        <Route
  path="/admin"
  element={
    rol === null ? (
      <p>Cargando...</p>
    ) : rol === 'admin' ? (
      <div className="admin-container">
        <AdminProductForm onProductAdded={fetchProducts} />
      </div>
    ) : (
      <Navigate to="/" />
    )
  }
/>

        <Route
          path="/"
          element={
            <>
              {/* Hero */}
              <section className="hero">
                <img src="/icon_sinfondo.png" alt="Logo Tienda" className="simbolo-deco" />
                <section>
                  <h1>Alma Mineral</h1>
                </section>
                <h3>by Sheila</h3>
                <p>
                  Cada pieza nace de mis manos, creada con intención, energía amorosa y el deseo profundo de acompañarte en tu camino. 
                  <br />Elijo cada mineral según su vibración y lo que estás viviendo, para que recibas no solo un accesorio, sino un amuleto con alma. 
                  <br />Aquí todo está hecho con calma, presencia y amor. Porque cuando algo se crea desde el corazón... brilla distinto
                </p>
                <button className="hero-btn" onClick={() => setMostrarModalIA(true)}>
                  Conecta con tu energía
                </button>
              </section>

              {/* 🔮 Modal Recomendador */}
              {mostrarModalIA && (
                <ModalRecomendador
                  onClose={() => setMostrarModalIA(false)}
                  allProducts={products}
                  user={user}
                  onAddToCart={addToCart}
                />
              )}

              {/* Productos */}
              <ProductList
                products={products}
                user={user}
                onAddToCart={addToCart}
              />

              
            </>
          }
        />

        <Route
  path="/producto/:id"
  element={
    <ProductDetail
      user={user}
      rol={rol}
      onAddToCart={addToCart}
      onProductUpdated={fetchProducts}
    />
    
  }
  
/>
<Route
  path="/creaciones"
  element={
    <Creaciones
      products={products}
      user={user}
      onAddToCart={addToCart}
    />
  }
/>

      </Routes>
      {productoAñadido && (
  <CartNotification
    producto={productoAñadido}
    onClose={() => setProductoAñadido(null)}
    onAbrirCarrito={() => {
      setMostrarCarrito(true);
      setProductoAñadido(null);
    }}
  />
)}

{mostrarCarrito && (
  <CartModal
    cart={cart}
    onClose={() => setMostrarCarrito(false)}
    onRemove={removeFromCart}
  total={total}
  />
)}
      {/* Auth modal fuera del switch */}
      {showAuthModal && (
        <div className="modal-overlay">
          <div className="auth-modal">
            <button 
              className="close-modal"
              onClick={() => setShowAuthModal(false)}
            >
              &times;
            </button>
            <Auth 
              onLogin={(user) => {
                setUser(user);
                setShowAuthModal(false);
              }} 
            />
          </div>
        </div>
      )}
      
    </Router>
  </div>
);

}

export default App;
