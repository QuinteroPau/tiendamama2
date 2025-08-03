import React, { useEffect, useRef, useState } from 'react';

function CartModal({ cart, onClose, onRemove, total }) {
  const startY = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const closeWithAnimation = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // ⏳ Igual que duración de slideOut
  };

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (!startY.current) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;

    if (diff > 60) {
      closeWithAnimation();
      startY.current = null;
    }
  };

  return (
    <div className="cart-modal-overlay" onClick={closeWithAnimation}>
      <div
        className={`cart-modal ${isClosing ? 'closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        ref={modalRef}
      >
        <div className="modal-drag-bar"></div>
        <h2>Tu bolsita</h2>
        {cart.length === 0 ? (
          <p>Tu bolsita está vacía...</p>
        ) : (
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.foto} alt={item.nombre} className="cart-item-img" />
                <div className="cart-item-info">
                  <p className="cart-item-nombre">{item.nombre}</p>
                  <p className="cart-item-precio">€{item.precio}</p>
                </div>
                <button className="quitar-btn" onClick={() => onRemove(item.id)}>
                  ✖ Quitar
                </button>
              </div>
            ))}
            <p className="total">Total: €{total}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartModal;
