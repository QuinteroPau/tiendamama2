import React, { useState } from 'react';
import RecomendadorIA from './RecomendadorIA';
import ProductList from './ProductList';
function normalizarTexto(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
function ModalRecomendador({ onClose, allProducts, user, onAddToCart }) {
  const [resultadoIA, setResultadoIA] = useState(null);

  const tiposDisponibles = Array.from(
    new Set(allProducts.map((p) => p.tipo?.toLowerCase()).filter(Boolean))
  );

  const productosFiltrados = resultadoIA?.esRecomendacion && resultadoIA?.mineral
  ? allProducts.filter((p) =>
      normalizarTexto(p.tipo).includes(normalizarTexto(resultadoIA.mineral))
    )
  : [];

const mineralDisponible = productosFiltrados.length > 0;



console.log("Mineral recomendado:", resultadoIA?.mineral);
console.log("Tipos de productos:", allProducts.map(p => p.tipo));
console.log("Productos filtrados:", productosFiltrados.map(p => p.tipo));


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

        {/* Mensaje espiritual */}
        {resultadoIA?.mensaje && (
          <div className="mensaje-espiritual">
            <p><em>{resultadoIA.mensaje}</em></p>
          </div>
        )}

        {/* Productos si hay recomendación y el mineral está en la tienda */}
        {resultadoIA?.esRecomendacion && mineralDisponible && (

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

        {/* Mensaje de no disponibilidad si el mineral no está en la tienda */}
        {resultadoIA?.esRecomendacion && !mineralDisponible && (

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
