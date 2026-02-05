import React from 'react';
import { Link } from 'react-router-dom';

function ProductList({ products, onAddToCart, user }) {
  const sorted = [...(products || [])].sort((a, b) => (a.vendido ? 1 : 0) - (b.vendido ? 1 : 0));

  return (
    <section className="products" id="productos">
      <div className="product-list">
        {sorted.map((product) => (
          <div key={product.id} className={`product-card-wrapper ${product.vendido ? 'vendido' : ''}`}>
            <Link to={`/creacion/${product.id}`} className="product-card-link">
              <div className="product-card">
                <div className="product-card-image-wrap">
                  {product.foto ? (
                    <img
                      src={product.foto}
                      alt={product.nombre}
                      className="product-image"
                    />
                  ) : (
                    <div className="product-image product-image-placeholder">Sin imagen</div>
                  )}
                  {product.vendido && <span className="sold-badge">Vendido</span>}
                </div>
                <h3>{product.nombre}</h3>
                <p className="desc">{product.desc}</p>
                <p className="price">€{product.precio}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductList;
