import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Loader2, Check, ShoppingBag, Tag, Zap } from 'lucide-react';
import { useAuth }  from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const BENEFITS = [
  { Icon: ShoppingBag, text: 'Acceso a todas las colecciones' },
  { Icon: Tag,         text: 'Descuentos exclusivos para miembros' },
  { Icon: Zap,         text: 'Checkout rápido y seguro' },
];

export default function Register() {
  const [form, setForm]     = useState({ nombre: '', correo: '', password: '', confirmar: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const { register }        = useAuth();
  const { showToast }       = useToast();
  const navigate            = useNavigate();
  const [params]            = useSearchParams();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.nombre.trim())          return setError('El nombre es obligatorio');
    if (!form.correo.includes('@'))   return setError('Correo inválido');
    if (form.password.length < 6)     return setError('La contraseña debe tener al menos 6 caracteres');
    if (form.password !== form.confirmar) return setError('Las contraseñas no coinciden');

    setLoading(true);
    try {
      await register(form.nombre.trim(), form.correo.toLowerCase().trim(), form.password);
      showToast(`Bienvenida, ${form.nombre.split(' ')[0]}. Tu cuenta fue creada`, 'success');
      const redirect = params.get('redirect') || '/productos';
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">

      
      <div className="hidden lg:flex flex-1 bg-primary relative overflow-hidden items-center justify-center p-12">
        <div className="absolute w-80 h-80 bg-white/10 rounded-full -top-32 -right-32" />
        <div className="absolute w-56 h-56 bg-white/10 rounded-full bottom-8 right-16" />
        <div className="absolute w-36 h-36 bg-white/10 rounded-full left-8 bottom-32" />
        <div className="absolute w-24 h-24 bg-white/10 rounded-full top-20 left-20" />

        <div className="relative z-10 max-w-md text-white">
          <span className="block text-3xl font-extrabold text-white/90 mb-6">Moda y Estilo Única</span>
          <h1 className="text-4xl font-extrabold leading-tight mb-6">
            Únete a nuestra comunidad de{' '}
            <span className="text-white/80">moda femenina</span>
          </h1>
          <p className="text-white/80 text-lg leading-relaxed mb-8">
            Crea tu cuenta y accede a descuentos exclusivos, colecciones nuevas y mucho más.
          </p>
          <div className="flex flex-col gap-4">
            {BENEFITS.map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-white/90 text-sm">
                <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                </span>
                <Icon className="w-4 h-4 text-white/70" strokeWidth={2} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      
      <div className="flex-1 lg:max-w-[520px] bg-background flex items-center justify-center p-8">
        <div className="w-full max-w-sm">

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-primary">Crear cuenta</h2>
            <p className="text-text-muted text-sm mt-2">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" id="register-form">

            <div>
              <label className="block text-sm font-semibold text-text-main mb-1.5">Nombre completo</label>
              <input id="reg-nombre" name="nombre" type="text" value={form.nombre}
                onChange={handleChange} placeholder="Ana García" className="input-field" required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-main mb-1.5">Correo electrónico</label>
              <input id="reg-correo" name="correo" type="email" value={form.correo}
                onChange={handleChange} placeholder="ana@ejemplo.com" className="input-field" required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-main mb-1.5">Contraseña</label>
              <div className="relative">
                <input id="reg-password" name="password" type={showPw ? 'text' : 'password'}
                  value={form.password} onChange={handleChange}
                  placeholder="Mínimo 6 caracteres" className="input-field pr-12" required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors">
                  {showPw
                    ? <EyeOff className="w-4 h-4" strokeWidth={2} />
                    : <Eye    className="w-4 h-4" strokeWidth={2} />
                  }
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-main mb-1.5">Confirmar contraseña</label>
              <input id="reg-confirmar" name="confirmar" type={showPw ? 'text' : 'password'}
                value={form.confirmar} onChange={handleChange}
                placeholder="Repite tu contraseña" className="input-field" required />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" strokeWidth={2} /> {error}
              </div>
            )}

            <button type="submit" id="btn-register" disabled={loading}
              className="btn-primary w-full py-3.5 text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} /> Creando cuenta...</>
                : <><Check className="w-4 h-4" strokeWidth={2.5} /> Crear cuenta</>
              }
            </button>

            <p className="text-center text-xs text-text-muted pt-2">
              Al registrarte aceptas nuestros términos de uso y política de privacidad.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
