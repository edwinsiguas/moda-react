import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingBag, Menu, X, ChevronDown,
  User, LogOut, Settings, Shield, Sparkles,
} from 'lucide-react';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const navLinks = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/productos', label: 'Productos', end: false },
  { to: '/ofertas', label: 'Ofertas', end: false },
  { to: '/tienda', label: 'Tienda', end: false },
  { to: '/contacto', label: 'Contacto', end: false },
];

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  const { carrito } = useCarrito();
  const { isLoggedIn, isAdmin, usuario, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownAbierto(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownAbierto(false);
    setMenuAbierto(false);
    showToast('Sesión cerrada correctamente', 'info');
    navigate('/');
  };

  const iniciales = usuario?.nombre
    ? usuario.nombre.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
      ? 'bg-surface/80 backdrop-blur-lg shadow-lg shadow-black/5 border-b border-primary/10'
      : 'bg-surface border-b border-primary/10'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">


          <Link to="/" className="flex items-center gap-2 text-primary font-extrabold text-xl tracking-wide hover:text-primary-dark transition-colors duration-200 flex-shrink-0">
            <Sparkles className="w-5 h-5" strokeWidth={2} />
            Moda y Estilo Única
          </Link>


          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to} end={end}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                      ? 'text-primary font-semibold bg-primary/8'
                      : 'text-text-main hover:text-primary hover:bg-primary/5'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>


          <div className="flex items-center gap-2">


            <Link
              to="/tienda"
              className="relative p-2 rounded-xl text-text-main hover:text-primary hover:bg-primary/5 transition-all duration-200"
              title="Ver carrito"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={2} />
              {carrito.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-extrabold w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-scale-in">
                  {carrito.length > 9 ? '9+' : carrito.length}
                </span>
              )}
            </Link>


            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownAbierto(!dropdownAbierto)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-primary/8 transition-all duration-200"
                  id="user-menu-btn"
                >
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shadow-sm">
                    {iniciales}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-text-main max-w-[100px] truncate">
                    {usuario?.nombre?.split(' ')[0]}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${dropdownAbierto ? 'rotate-180' : ''}`} strokeWidth={2} />
                </button>


                {dropdownAbierto && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl shadow-black/15 border border-gray-100 overflow-hidden animate-scale-in">
                    <div className="px-4 py-3 bg-primary/5 border-b border-primary/10">
                      <p className="text-sm font-semibold text-text-main truncate">{usuario?.nombre}</p>
                      <p className="text-xs text-text-muted truncate">{usuario?.correo}</p>
                      <span className={`mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${isAdmin ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                        }`}>
                        {isAdmin
                          ? <><Shield className="w-3 h-3" /> Admin</>
                          : <><ShoppingBag className="w-3 h-3" /> Cliente</>
                        }
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownAbierto(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-main hover:bg-primary/5 hover:text-primary transition-colors"
                      >
                        <User className="w-4 h-4" strokeWidth={2} /> Mi Cuenta
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownAbierto(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-amber-700 hover:bg-amber-50 transition-colors"
                        >
                          <Settings className="w-4 h-4" strokeWidth={2} /> Panel Admin
                        </Link>
                      )}

                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          id="btn-logout-dropdown"
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" strokeWidth={2} /> Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm py-2">Entrar</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Registrarse</Link>
              </div>
            )}


            <button
              className="lg:hidden p-2 rounded-xl text-text-main hover:text-primary hover:bg-primary/5 transition-all"
              onClick={() => setMenuAbierto(!menuAbierto)}
              aria-label="Menú"
            >
              {menuAbierto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>


        {menuAbierto && (
          <div className="lg:hidden pb-4 pt-2 border-t border-primary/10 animate-fade-in-up">
            <ul className="flex flex-col gap-1 mb-3">
              {navLinks.map(({ to, label, end }) => (
                <li key={to}>
                  <NavLink
                    to={to} end={end}
                    onClick={() => setMenuAbierto(false)}
                    className={({ isActive }) =>
                      `block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'text-primary bg-primary/8 font-semibold' : 'text-text-main hover:text-primary hover:bg-primary/5'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {!isLoggedIn && (
              <div className="flex gap-2 px-2 pt-2 border-t border-primary/10">
                <Link to="/login" onClick={() => setMenuAbierto(false)} className="btn-ghost flex-1 text-center text-sm">Entrar</Link>
                <Link to="/register" onClick={() => setMenuAbierto(false)} className="btn-primary flex-1 text-center text-sm">Registrarse</Link>
              </div>
            )}
            {isLoggedIn && (
              <div className="px-2 pt-2 border-t border-primary/10">
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                  <LogOut className="w-4 h-4" strokeWidth={2} /> Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
