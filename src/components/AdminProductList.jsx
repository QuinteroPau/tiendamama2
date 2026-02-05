import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function AdminProductList({ onProductChanged }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('productos').select('*').order('id', { ascending: false });
    if (!error) setProducts(data || []);
    setLoading(false);
    onProductChanged?.();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleVendido = async (product) => {
    const nuevoEstado = !product.vendido;
    const accion = nuevoEstado ? 'marcar como vendido' : 'marcar como disponible';
    const confirmar = window.confirm(
      `¿Quieres ${accion} "${product.nombre}"?`
    );
    if (!confirmar) return;

    setMarkingId(product.id);
    setErrorMsg('');

    const { error } = await supabase
      .from('productos')
      .update({ vendido: nuevoEstado })
      .eq('id', product.id);

    if (error) {
      setErrorMsg(error.message || 'Error al actualizar el producto');
      setMarkingId(null);
    } else {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, vendido: nuevoEstado } : p))
      );
      setMarkingId(null);
      if (onProductChanged) onProductChanged();
    }
  };

  if (loading) return <p className="admin-loading">Cargando productos...</p>;

  if (products.length === 0) {
    return (
      <div className="admin-empty">
        <p>No hay creaciones todavía.</p>
        <Link to="/admin/nueva" className="admin-empty-btn">+ Crear mi primera creación</Link>
      </div>
    );
  }

  return (
    <div className="admin-product-list">
      <div className="admin-list-header">
        <h2>Mis creaciones ({products.length})</h2>
        <Link to="/admin/nueva" className="admin-add-btn">+ Añadir nueva</Link>
      </div>
      {errorMsg && <p className="error">{errorMsg}</p>}
      <div className="admin-products-grid">
        {products.map((product) => (
          <div key={product.id} className={`admin-product-card ${product.vendido ? 'vendido' : ''}`}>
            <div className="admin-product-image">
              {product.foto ? (
                <img src={product.foto} alt={product.nombre} />
              ) : (
                <div className="admin-product-placeholder">Sin imagen</div>
              )}
              {product.vendido && <span className="admin-badge-vendido">Vendido</span>}
            </div>
            <div className="admin-product-info">
              <h3>{product.nombre}</h3>
              <p className="admin-product-precio">€{product.precio}</p>
            </div>
            <div className="admin-product-actions">
              <Link to={`/creacion/${product.id}`} className="admin-btn admin-btn-edit">
                Editar
              </Link>
              <button
                type="button"
                className="admin-btn admin-btn-vendido"
                onClick={() => handleToggleVendido(product)}
                disabled={markingId === product.id}
              >
                {markingId === product.id ? '...' : product.vendido ? 'Disponible' : 'Vendido'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminProductList;
