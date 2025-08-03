import ProductList from './ProductList';

const Creaciones = ({ products, user, onAddToCart }) => {
  return (
    <div className="creaciones-page" style={{ paddingTop: '100px' }}>
      <ProductList products={products} user={user} onAddToCart={onAddToCart} />
    </div>
  );
};

export default Creaciones;
