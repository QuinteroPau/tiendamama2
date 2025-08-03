import React, { useState } from 'react';
import RecomendadorIA from './RecomendadorIA';
import ProductList from './ProductList';

function ModalRecomendador({ onClose, allProducts, user, onAddToCart }) {
  const [piedraRecomendada, setPiedraRecomendada] = useState(null);

const [consultaRealizada, setConsultaRealizada] = useState(false);
  const productosFiltrados =
    typeof piedraRecomendada === 'string'
      ? allProducts.filter((p) =>
          p.tipo?.toLowerCase().includes(piedraRecomendada.toLowerCase())
        )
      : [];
const tiposDisponibles = Array.from(
  new Set(allProducts.map((p) => p.tipo?.toLowerCase()).filter(Boolean))
);

  return (
    <div className="modal-overlay">
      <div className="modal-recomendador">
        <button className="close-modal" onClick={onClose}>
          &times;
        </button>

        <RecomendadorIA
  tiposDisponibles={tiposDisponibles}
  onResultado={(respuesta) => {
    setConsultaRealizada(true); // marcar que el usuario pidió algo
    const texto = respuesta.toLowerCase();
    const match = tiposDisponibles.find((tipo) => texto.includes(tipo));
    setPiedraRecomendada(match || 'no-disponible');
  }}
/>



        {piedraRecomendada && piedraRecomendada !== 'no-disponible' ? (
          <>
            <h3 className="subtitulo-recomendados">
              Collares con {piedraRecomendada}
            </h3>
            <ProductList
              products={productosFiltrados}
              user={user}
              onAddToCart={onAddToCart}
            />
          </>
        ) : piedraRecomendada === 'no-disponible' && consultaRealizada ? (

          <div className="mensaje-no-disponible">
            <p>
              No tengo creaciones disponibles con ese mineral ahora mismo, pero puedes escribirme y haré una personalizada para ti.
            </p>
            <a
              className="boton-contacto"
              href="https://wa.me/34619652983?text=Hola%20Sheila,%20me%20interesa%20una%20creación%20con..."
              target="_blank"
              rel="noopener noreferrer"
            >
              Pedir por WhatsApp
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ModalRecomendador;
