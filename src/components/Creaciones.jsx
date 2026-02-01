import ProductList from './ProductList';

const Creaciones = ({ products, user, onAddToCart }) => {
  return (
    <div className="creaciones-page">
      <h2 className="creaciones-title">Nuestras creaciones</h2>
      <ProductList products={products} user={user} onAddToCart={onAddToCart} />
    </div>
  );
};

export default Creaciones;
