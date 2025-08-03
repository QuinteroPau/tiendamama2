import React, { useState, useEffect } from 'react';

function RecomendadorIA({ onResultado, tiposDisponibles }) {
  const [input, setInput] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [loading, setLoading] = useState(false);

  const obtenerRecomendacion = async () => {
    setLoading(true);
    const res = await fetch('https://tiendamama-backend.onrender.com/api/recomendar', {
  method: 'POST',
  body: JSON.stringify({ mensaje: input, tiposDisponibles }),  // incluye tipos
  headers: { 'Content-Type': 'application/json' }
});


    const data = await res.json();
    setRespuesta(data.recomendacion);
    setLoading(false);
    if (onResultado) onResultado(data.recomendacion);
  };

  return (
    <div className="ia-section">
      <p>Cuéntame tu situación y te recomendaré un mineral</p>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ej: Busco sentirme bien en mi trabajo..."
        rows={4}
      />
      <button onClick={obtenerRecomendacion} disabled={loading}>
        {loading ? 'Consultando energía...' : 'Obtener recomendación'}
      </button>
      {respuesta && <p className="recomendacion">{respuesta}</p>}
    </div>
  );
}

export default RecomendadorIA;
