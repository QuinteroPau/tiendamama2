// src/components/ProductDetail.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function ProductDetail({ onAddToCart, user, rol, onProductUpdated }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
const [editing, setEditing] = useState(false);
const [form, setForm] = useState({});
const [newImage, setNewImage] = useState(null);
  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('id', id)
        .single();
      if (data) {setProduct(data);
  setForm(data);}
    };
    fetchProduct();
    
  }, [id]);
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setForm((prev) => ({ ...prev, [name]: value }));
};

const handleSave = async () => {
  let imageUrl = form.foto;

  // 1. Si hay imagen nueva, subirla al bucket
  if (newImage) {
    const fileExt = newImage.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase
      .storage
      .from('productos')
      .upload(filePath, newImage);

    if (uploadError) {
      alert('❌ Error al subir la imagen');
      return;
    }

    const { data: publicUrlData } = supabase
      .storage
      .from('productos')
      .getPublicUrl(filePath);

    imageUrl = publicUrlData.publicUrl;
  }

  // 2. Actualizar producto con la nueva imagen (si se cambió) y los demás campos
  const { error } = await supabase
    .from('productos')
    .update({
      nombre: form.nombre,
      precio: parseFloat(form.precio),
      desc: form.desc,
      desc_long: form.desc_long,
      foto: imageUrl,
    })
    .eq('id', id);

  if (!error) {
    setProduct({ ...form, foto: imageUrl });
    setEditing(false);
    setNewImage(null);
    if (onProductUpdated) onProductUpdated();
    alert('✅ Producto actualizado con éxito');
  } else {
    alert('❌ Error al guardar los cambios');
  }
};


  if (!product) return <p>Cargando...</p>;

  return (
    <section className="product-detail">
      <div className="product-detail-card">
        {editing ? (
  <div className="image-edit-container">
    <input
      type="file"
      id="fileInput"
      accept="image/*"
      style={{ display: 'none' }}
      onChange={(e) => setNewImage(e.target.files[0])}
    />
    <img
      src={newImage ? URL.createObjectURL(newImage) : form.foto}
      alt="Producto"
      className="editable-image"
      onClick={() => document.getElementById('fileInput').click()}
    />
    <div className="edit-icon" onClick={() => document.getElementById('fileInput').click()}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="20"
        viewBox="0 0 24 24"
        width="20"
        fill="#7b4f35"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 
                 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 
                 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 
                 1.84-1.82z" />
      </svg>
    </div>
  </div>
) : (
  <img src={product.foto} alt={product.nombre} className="product-image-large" />
)}

        <div className="product-detail-content">
          {editing ? (
            <>
              <input type="text" name="nombre" value={form.nombre} onChange={handleInputChange} />
              <input type="number" name="precio" value={form.precio} onChange={handleInputChange} />
              <textarea name="desc_long" value={form.desc_long} onChange={handleInputChange}></textarea>
              <textarea name="desc" value={form.desc} onChange={handleInputChange}></textarea>
              <div className="editor-actions">
              <button onClick={handleSave}>Guardar</button>
              <button onClick={() => setEditing(false)}>Cancelar</button></div>
            </>
          ) : (
            <>
              <h1>{product.nombre}</h1>
              <p className="price">€{product.precio}</p>
              <p className="desc">{product.desc_long}</p>
              {user && rol !== 'admin' && (
  <button onClick={() => onAddToCart(product)}>
    Agregar al carrito
  </button>
)}
{!user && (
  <button onClick={() => alert('Inicia sesión para comprar')}>
    Inicia sesión para comprar
  </button>
)}

              {rol === 'admin' && (
                <button onClick={() => setEditing(true)} style={{ marginTop: '1rem' }}>
                  ✏️ Editar producto
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );

}

export default ProductDetail;
