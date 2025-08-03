import { useState } from 'react';
import { supabase } from '../supabaseClient';

function AdminProductForm({ onProductAdded }) {
  const [form, setForm] = useState({
    nombre: '',
    tipo: '',
    precio: '',
    desc: '',
    desc_long: '',
    imagen: null
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imagen') {
      setForm({ ...form, imagen: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccess(false);

    try {
      let imageUrl = '';

      if (form.imagen) {
        const fileExt = form.imagen.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase
          .storage
          .from('productos')
          .upload(filePath, form.imagen);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase
          .storage
          .from('productos')
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      const { error } = await supabase
        .from('productos')
        .insert({
          nombre: form.nombre,
          tipo: form.tipo,
          precio: parseFloat(form.precio),
          desc: form.desc,
          desc_long: form.desc_long,
          foto: imageUrl
        });

      if (error) throw error;

      setSuccess(true);
      if (onProductAdded) onProductAdded();
      resetForm();
    } catch (error) {
      setErrorMsg(error.message || 'Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      nombre: '',
      tipo: '',
      precio: '',
      desc: '',
      desc_long: '',
      imagen: null
    });
  };

  return (
    <div className="admin-form">
      <h2>Añadir nueva creación</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
        <input type="text" name="tipo" placeholder="Piedra" value={form.tipo} onChange={handleChange} required />
        <input type="number" step="0.01" name="precio" placeholder="Precio" value={form.precio} onChange={handleChange} required />
        <textarea name="desc" placeholder="Descripción corta" value={form.desc} onChange={handleChange} required></textarea>
        <textarea name="desc_long" placeholder="Descripción larga" value={form.desc_long} onChange={handleChange} required></textarea>
        <input type="file" name="imagen" accept="image/*" onChange={handleChange} />

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar producto'}
          </button>
        </div>
      </form>

      {errorMsg && <p className="error">{errorMsg}</p>}
      {success && <p className="success">✅ Producto guardado con éxito</p>}
    </div>
  );
}

export default AdminProductForm;
