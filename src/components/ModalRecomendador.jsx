import React, { useState } from 'react';
import RecomendadorIA from './RecomendadorIA';
import ProductList from './ProductList';

function ModalRecomendador({ onClose, allProducts, user, onAddToCart }) {
  const [piedraRecomendada, setPiedraRecomendada] = useState(null);
const [resultadoIA, setResultadoIA] = useState(null);
const [consultaRealizada, setConsultaRealizada] = useState(false);
  const productosFiltrados = resultadoIA?.esRecomendacion && resultadoIA?.mineral !== 'no-disponible'
  ? allProducts.filter((p) =>
      p.tipo?.toLowerCase().includes(resultadoIA.mineral.toLowerCase())
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
  onResultado={(res) => setResultadoIA(res)}
/>



        {resultadoIA?.esRecomendacion && resultadoIA.mineral !== 'no-disponible' && (
  <>
    <h3 className="subtitulo-recomendados">
      Collares con {resultadoIA.mineral}
    </h3>
    <ProductList
      products={productosFiltrados}
      user={user}
      onAddToCart={onAddToCart}
    />
  </>
)}

{resultadoIA?.esRecomendacion && resultadoIA.mineral === 'no-disponible' && (
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
)}

      </div>
    </div>
  );
}

export default ModalRecomendador;
