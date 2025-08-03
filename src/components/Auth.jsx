import { useState } from 'react';
import { supabase } from '../supabaseClient';
import '../index.css';

function Auth({ onLogin, onClose }) {  // Added onClose prop
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: pass,
        });

        if (error) throw error;

        const { user } = data;
        if (!user.email_confirmed_at) {
          throw new Error('Debes confirmar tu correo antes de entrar');
        }

        onLogin(user);
        onClose();  // Close modal after successful login
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password: pass,
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          await supabase.from('perfiles').insert({
            id: data.user.id,
            rol: 'cliente',
          });
        }

        setSuccessMsg('Revisa tu correo para confirmar tu cuenta');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="auth-modal-content">
    <form onSubmit={handleSubmit} className="admin-form">
      <h1>{isLogin ? 'Iniciar sesión' : 'Registrarse'}</h1>

      {/* Mostrar inputs solo si no hay mensaje de éxito */}
      {!successMsg && (
        <>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Cargando...' : isLogin ? 'Entrar' : 'Registrarse'}
          </button>
          <p style={{ textAlign: 'center' }}>
            <a href="#" onClick={(e) => {
              e.preventDefault();
              setIsLogin(!isLogin);
              setError('');
              setSuccessMsg('');
            }}>
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </a>
          </p>
        </>
      )}

      {error && <p className="error">{error}</p>}
      {successMsg && <p className="success">{successMsg}</p>}
    </form>
  </div>
);

}

export default Auth;