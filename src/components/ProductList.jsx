import React from 'react';
import { Link } from 'react-router-dom';

function ProductList({ products, onAddToCart, user }) {
  return (
    <section className="products" id="productos">
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-card-wrapper">
            <Link to={`/producto/${product.id}`} className="product-card-link">
              <div className="product-card">
                {product.foto ? (
                  <img
                    src={product.foto}
                    alt={product.nombre}
                    className="product-image"
                  />
                ) : (
                  <div className="product-image product-image-placeholder">Sin imagen</div>
                )}
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
