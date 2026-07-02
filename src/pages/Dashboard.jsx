import { User, BarChart3, ShoppingBag, Tag, FolderOpen, CheckCircle2, Shield, Settings, LogOut } from 'lucide-react';
import { useAuth }  from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Link, useNavigate } from 'react-router-dom';

const STATS = [
  { label: 'Productos',  value: '12',     Icon: ShoppingBag  },
  { label: 'Ofertas',    value: '8',       Icon: Tag          },
  { label: 'Categorías', value: '7',       Icon: FolderOpen   },
  { label: 'Estado',     value: 'Activo',  Icon: CheckCircle2 },
];

export default function Dashboard() {
  const { usuario, isAdmin, logout } = useAuth();
  const { showToast }                = useToast();
  const navigate                     = useNavigate();

  const cerrarSesion = () => {
    logout();
    showToast('Sesión cerrada correctamente', 'info');
    navigate('/');
  };

  if (!usuario) return null;

  const iniciales = usuario.nombre
    .split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="bg-background min-h-screen">

      
      <div className="bg-gradient-to-r from-primary to-primary-dark py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-extrabold text-white mx-auto mb-4 shadow-xl">
          {iniciales}
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-1">
          Hola, {usuario.nombre.split(' ')[0]}
        </h1>
        <div className="flex items-center justify-center gap-1.5 text-white/80 mt-1">
          {isAdmin
            ? <><Shield className="w-4 h-4" strokeWidth={2} /> Administrador del sistema</>
            : <><ShoppingBag className="w-4 h-4" strokeWidth={2} /> Cliente</>
          }
        </div>
      </div>

      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          
          <div className="bg-white rounded-2xl p-6 shadow-md border border-primary/10">
            <h3 className="text-primary font-bold text-lg mb-4 flex items-center gap-2">
              <User className="w-5 h-5" strokeWidth={2} /> Información de la cuenta
            </h3>
            <div className="divider" />
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Nombre</span>
                <span className="font-semibold text-text-main">{usuario.nombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Correo</span>
                <span className="font-semibold text-text-main">{usuario.correo}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Rol</span>
                <span className={`inline-flex items-center gap-1 font-bold px-2.5 py-1 rounded-full text-xs ${
                  isAdmin ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                }`}>
                  {isAdmin
                    ? <><Shield className="w-3 h-3" /> Admin</>
                    : <><ShoppingBag className="w-3 h-3" /> Cliente</>
                  }
                </span>
              </div>
            </div>
          </div>

          
          <div className="bg-white rounded-2xl p-6 shadow-md border border-primary/10">
            <h3 className="text-primary font-bold text-lg mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" strokeWidth={2} /> Resumen general
            </h3>
            <div className="divider" />
            <div className="grid grid-cols-2 gap-4">
              {STATS.map(({ label, value, Icon }) => (
                <div key={label} className="text-center p-3 bg-background rounded-xl">
                  <Icon className="w-6 h-6 text-primary mx-auto mb-1" strokeWidth={1.5} />
                  <p className="font-extrabold text-primary text-xl">{value}</p>
                  <p className="text-text-muted text-xs">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/productos" className="btn-outline flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" strokeWidth={2} /> Ver Productos
          </Link>
          {isAdmin && (
            <Link to="/admin"
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg flex items-center gap-2">
              <Settings className="w-4 h-4" strokeWidth={2} /> Panel Admin
            </Link>
          )}
          <button onClick={cerrarSesion} id="btn-logout"
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2">
            <LogOut className="w-4 h-4" strokeWidth={2} /> Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
