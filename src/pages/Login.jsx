import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth }  from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [correo, setCorreo]     = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login }               = useAuth();
  const { showToast }           = useToast();
  const navigate                = useNavigate();
  const [params]                = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!correo || !password) return setError('Completa todos los campos');

    setLoading(true);
    try {
      const user = await login(correo.trim(), password);
      showToast(`Bienvenida de nuevo, ${user.nombre.split(' ')[0]}`, 'success');
      const redirect = params.get('redirect');
      if (redirect) navigate(redirect, { replace: true });
      else if (user.rol === 'admin') navigate('/admin', { replace: true });
      else navigate('/productos', { replace: true });
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">

      
      <div className="hidden lg:flex flex-1 bg-primary relative overflow-hidden items-center justify-center p-12">
        <div className="absolute w-80 h-80 bg-white/10 rounded-full -top-32 -right-32" />
        <div className="absolute w-52 h-52 bg-white/10 rounded-full bottom-8 right-16" />
        <div className="absolute w-32 h-32 bg-white/10 rounded-full left-8 bottom-28" />
        <div className="relative z-10 max-w-md text-white">
          <span className="block text-3xl font-extrabold text-white/90 mb-6">Moda y Estilo Única</span>
          <h1 className="text-4xl font-extrabold leading-tight mb-6">
            Bienvenida a tu tienda de{' '}
            <span className="text-white/80">moda femenina</span>
          </h1>
          <p className="text-white/80 text-lg leading-relaxed">
            Descubre prendas únicas diseñadas para resaltar tu estilo y personalidad.
          </p>
        </div>
      </div>

      
      <div className="flex-1 lg:max-w-[500px] bg-background flex items-center justify-center p-8">
        <div className="w-full max-w-sm">

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-primary">Iniciar sesión</h2>
            <p className="text-text-muted text-sm mt-2">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-primary font-semibold hover:underline">
                Regístrate gratis
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" id="login-form">

            <div>
              <label className="block text-sm font-semibold text-text-main mb-1.5">
                Correo electrónico
              </label>
              <input
                id="input-correo" type="email" value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="admin@modayestilo.com.pe" className="input-field" required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-main mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="input-password" type={showPw ? 'text' : 'password'}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña" className="input-field pr-12" required
                />
                <button
                  type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                  id="toggle-password"
                >
                  {showPw
                    ? <EyeOff className="w-4 h-4" strokeWidth={2} />
                    : <Eye    className="w-4 h-4" strokeWidth={2} />
                  }
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" strokeWidth={2} /> {error}
              </div>
            )}

            <button type="submit" id="btn-login" disabled={loading}
              className="btn-primary w-full py-3.5 text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} /> Verificando...</>
                : <><Lock className="w-4 h-4" strokeWidth={2} /> Ingresar</>
              }
            </button>
          </form>

          
          <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
            <p className="font-semibold mb-1 flex items-center gap-1">
              <Lock className="w-3 h-3" strokeWidth={2} /> Credenciales de demo (Admin)
            </p>
            <p>admin@modayestilo.com.pe / Moda2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
