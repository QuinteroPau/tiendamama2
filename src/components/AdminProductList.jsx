import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function AdminProductList({ onProductChanged }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
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

  const handleDelete = async (product) => {
    const confirmar = window.confirm(
      `¿Estás segura de que quieres eliminar "${product.nombre}"? Esta acción no se puede deshacer.`
    );
    if (!confirmar) return;

    setDeletingId(product.id);
    setErrorMsg('');

    const { error } = await supabase.from('productos').delete().eq('id', product.id);

    if (error) {
      setErrorMsg(error.message || 'Error al eliminar el producto');
      setDeletingId(null);
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      setDeletingId(null);
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
          <div key={product.id} className="admin-product-card">
            <div className="admin-product-image">
              {product.foto ? (
                <img src={product.foto} alt={product.nombre} />
              ) : (
                <div className="admin-product-placeholder">Sin imagen</div>
              )}
            </div>
            <div className="admin-product-info">
              <h3>{product.nombre}</h3>
              {product.tipo && <span className="admin-product-tipo">{product.tipo}</span>}
              <p className="admin-product-precio">€{product.precio}</p>
            </div>
            <div className="admin-product-actions">
              <Link to={`/producto/${product.id}`} className="admin-btn admin-btn-edit">
                Editar
              </Link>
              <button
                type="button"
                className="admin-btn admin-btn-delete"
                onClick={() => handleDelete(product)}
                disabled={deletingId === product.id}
              >
                {deletingId === product.id ? '...' : 'Borrar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminProductList;
