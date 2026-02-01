import React, { useEffect, useRef, useState } from 'react';

function CartModal({ cart, onClose, onRemove, total }) {
  const startY = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.classList.add('cart-modal-open');
    document.body.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      document.body.classList.remove('cart-modal-open');
      document.body.style.removeProperty('--scrollbar-width');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
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
function generarMensajeWhatsApp(cart) {
  let mensaje = '¡Hola Sheila! Me gustaría hacer este pedido:\n\n';

  cart.forEach((item, index) => {
    mensaje += `${index + 1}. ${item.nombre} - €${item.precio}\n`;
  });

  const total = cart.reduce((acc, item) => acc + item.precio, 0).toFixed(2);
  mensaje += `\n¿Está disponible?\n`;

  return mensaje;
}

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
        {cart.length > 0 && (
  <a
    href={`https://wa.me/34619652983?text=${encodeURIComponent(generarMensajeWhatsApp(cart))}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    <button className="checkout-btn">Pedir minerales por WhatsApp</button>
  </a>
)}
        {/* 
        {cart.length > 0 && (
  <button
    className="checkout-btn"
    onClick={async () => {
      try {
        const response = await fetch('http://localhost:3000/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cart }),
        });

        const data = await response.json();

        if (data.url) {
          window.location.href = data.url; // 🔁 redirección a Stripe Checkout
        } else {
          alert("Error al crear la sesión de pago");
        }
      } catch (err) {
        console.error('Error al conectar con Stripe:', err);
        alert('Error al conectar con Stripe');
      }
    }}
  >
    Finalizar compra
  </button>
)}*/}

      </div>
      
    </div>
  );
}

export default CartModal;
