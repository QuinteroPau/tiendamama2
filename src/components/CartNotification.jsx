import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CartNotification({ producto, onClose, onAbrirCarrito }) {
  const navigate = useNavigate();
  const [disappear, setDisappear] = useState(false);

  useEffect(() => {
    // Línea de tiempo para desaparecer visualmente
    const timeout = setTimeout(() => {
      setDisappear(true);
      setTimeout(() => onClose(), 300); // Espera a que termine la animación
    }, 10000);

    return () => clearTimeout(timeout);
  }, [onClose]);

  const handleSeguirExplorando = () => {
    navigate('/creaciones');
    onClose();
  };

  return (
    <div className={`cart-notification ${disappear ? 'disappear' : ''}`}>
      <p><strong>{producto.nombre}</strong> añadido a tu bolsita</p>
      <div className="cart-notification-actions">
        <button onClick={handleSeguirExplorando}>Seguir explorando</button>
        <button onClick={onAbrirCarrito}>Ver bolsita</button>
      </div>
      <div className="progress-bar" />
    </div>
  );
}

export default CartNotification;
