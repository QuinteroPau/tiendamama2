import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import '../index.css';

function Auth({ onLogin, onClose }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [passConfirm, setPassConfirm] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const checkCapsLock = (e) => {
    if (e.getModifierState) {
      setCapsLockOn(e.getModifierState('CapsLock'));
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', checkCapsLock);
    window.addEventListener('keyup', checkCapsLock);
    return () => {
      window.removeEventListener('keydown', checkCapsLock);
      window.removeEventListener('keyup', checkCapsLock);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    if (!isLogin && pass !== passConfirm) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

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

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccessMsg('');
    setPassConfirm('');
  };

  const EyeIcon = ({ show }) => (show ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ));

  return (
    <div className="auth-modal-content">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2 className="auth-title">{isLogin ? 'Iniciar sesión' : 'Registrarse'}</h2>

        {!successMsg && (
          <>
            <div className="auth-field">
              <label htmlFor="auth-email">Correo electrónico</label>
              <input
                id="auth-email"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={checkCapsLock}
                onKeyUp={checkCapsLock}
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="auth-password">{isLogin ? 'Contraseña' : 'Contraseña'}</label>
              <div className="auth-password-wrap">
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={isLogin ? 'Tu contraseña' : 'Mín. 6 caracteres'}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  onKeyDown={checkCapsLock}
                  onKeyUp={checkCapsLock}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  required
                />
                <button
                  type="button"
                  className="auth-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  <EyeIcon show={showPassword} />
                </button>
              </div>
              {capsLockOn && (
                <p className="auth-caps-hint" role="status">
                  <span className="auth-caps-icon">⇪</span> Bloq Mayús está activado
                </p>
              )}
            </div>

            {!isLogin && (
              <div className="auth-field">
                <label htmlFor="auth-password-confirm">Repetir contraseña</label>
                <div className="auth-password-wrap">
                  <input
                    id="auth-password-confirm"
                    type={showPasswordConfirm ? 'text' : 'password'}
                    placeholder="Vuelve a escribir la contraseña"
                    value={passConfirm}
                    onChange={(e) => setPassConfirm(e.target.value)}
                    onKeyDown={checkCapsLock}
                    onKeyUp={checkCapsLock}
                    autoComplete="new-password"
                    required={!isLogin}
                  />
                  <button
                    type="button"
                    className="auth-toggle-password"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    title={showPasswordConfirm ? 'Ocultar contraseña' : 'Ver contraseña'}
                    aria-label={showPasswordConfirm ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    <EyeIcon show={showPasswordConfirm} />
                  </button>
                </div>
              </div>
            )}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Cargando...' : isLogin ? 'Entrar' : 'Crear cuenta'}
            </button>

            <p className="auth-switch">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
              <button type="button" className="auth-switch-link" onClick={switchMode}>
                {isLogin ? 'Regístrate' : 'Inicia sesión'}
              </button>
            </p>
          </>
        )}

        {error && <p className="auth-error">{error}</p>}
        {successMsg && <p className="auth-success">{successMsg}</p>}
      </form>
    </div>
  );

}

export default Auth;