import { useState, useEffect } from 'react';
import { useNavigate }          from 'react-router-dom';
import { ShoppingBag, Loader2, Search, SlidersHorizontal, ArrowRight, Tag } from 'lucide-react';
import { getProducts }  from '../services/api';
import { useCarrito }     from '../context/CarritoContext';
import { useAuth }        from '../context/AuthContext';
import { useToast }       from '../context/ToastContext';

const CATEGORIAS = ['Todas', 'Vestidos', 'Blusas', 'Pantalones', 'Faldas', 'Blazers', 'Accesorios', 'Calzado'];

export default function Offers() {
  const [offers, setOffers]           = useState([]);
  const [filtered, setFiltered]       = useState([]);
  const [searchText, setSearchText]   = useState('');
  const [activeCategory, setCategory] = useState('Todas');
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const { agregarProducto }           = useCarrito();
  const { isLoggedIn }                = useAuth();
  const { showToast }                 = useToast();
  const navigate                      = useNavigate();

  useEffect(() => {
    getProducts()
      .then((data) => {
        const soloOfertas = data.filter((p) => p.discount > 0);
        setOffers(soloOfertas);
        setFiltered(soloOfertas);
        setLoading(false);
      })
      .catch(() => { setError('Error al cargar las ofertas.'); setLoading(false); });
  }, []);

  useEffect(() => {
    const result = offers.filter((p) => {
      const nombre = p.name.toLowerCase().includes(searchText.toLowerCase());
      const cat    = activeCategory === 'Todas' || p.category === activeCategory;
      return nombre && cat;
    });
    setFiltered(result);
  }, [searchText, activeCategory, offers]);

  const handleAgregar = (product) => {
    if (!isLoggedIn) {
      showToast('Debes iniciar sesión para agregar al carrito', 'warning');
      navigate(`/login?redirect=${encodeURIComponent('/ofertas')}`);
      return;
    }
    agregarProducto(product);
    showToast(`${product.name} agregado al carrito`, 'success');
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-text-muted text-sm">Cargando ofertas...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <p className="text-red-600 bg-red-50 border border-red-200 rounded-2xl p-6 text-sm">{error}</p>
    </div>
  );

  const maxDescuento = offers.length > 0 ? Math.max(...offers.map((o) => o.discount)) : 0;

  return (
    <div className="bg-background min-h-screen pb-20">

      
      <div className="relative bg-primary overflow-hidden py-16">
        <div className="absolute w-72 h-72 bg-white/10 rounded-full -top-20 -right-20" />
        <div className="absolute w-48 h-48 bg-white/10 rounded-full bottom-0 left-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            <Tag className="w-4 h-4" strokeWidth={2} /> Ofertas especiales
          </span>
          <h1 className="text-5xl font-extrabold text-white mb-3">Descuentos Exclusivos</h1>
          <p className="text-white/80 text-lg">
            {offers.length} prendas con descuentos de hasta{' '}
            <span className="font-bold text-white">{maxDescuento}%</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" strokeWidth={2} />
          <input
            id="search-offers"
            type="text"
            placeholder="Buscar ofertas..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="input-field pl-11"
          />
        </div>

        
        <div className="flex items-center gap-2 flex-wrap mb-8">
          <SlidersHorizontal className="w-4 h-4 text-text-muted flex-shrink-0" strokeWidth={2} />
          {CATEGORIAS.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`chip ${activeCategory === cat ? 'chip-active' : 'chip-inactive'}`}>
              {cat}
            </button>
          ))}
        </div>

        
        <p className="text-text-muted text-sm mb-6">
          {filtered.length === 0 ? 'Sin resultados'
            : `${filtered.length} ${filtered.length === 1 ? 'oferta encontrada' : 'ofertas encontradas'}`}
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Tag className="w-12 h-12 text-text-muted/40 mx-auto mb-4" strokeWidth={1.5} />
            <p className="text-text-muted mb-4">No se encontraron ofertas con esos filtros.</p>
            <button onClick={() => { setSearchText(''); setCategory('Todas'); }} className="btn-outline text-sm">
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => {
              const precioFinal = product.price - (product.price * product.discount) / 100;
              return (
                <div key={product.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-black/12 transition-all duration-300 hover:-translate-y-2 flex flex-col">

                  <div className="relative overflow-hidden h-72">
                    <img src={product.image} alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-red-500 text-white font-extrabold text-sm px-3 py-1.5 rounded-xl shadow-lg">
                      <Tag className="w-3.5 h-3.5" strokeWidth={2.5} />
                      -{product.discount}%
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-xs font-semibold text-primary/70 uppercase tracking-wider mb-1">
                      {product.category}
                    </span>
                    <h3 className="font-bold text-text-main text-base mb-3 line-clamp-2">{product.name}</h3>

                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-text-muted text-sm line-through">S/ {product.price.toFixed(2)}</span>
                      <span className="text-xs bg-red-100 text-red-600 font-semibold px-1.5 py-0.5 rounded">
                        -{product.discount}%
                      </span>
                    </div>
                    <span className="text-primary font-extrabold text-2xl mb-4">S/ {precioFinal.toFixed(2)}</span>

                    <button onClick={() => handleAgregar(product)} id={`add-offer-${product.id}`}
                      className="btn-primary mt-auto text-sm py-2.5 w-full flex items-center justify-center gap-2">
                      <ShoppingBag className="w-4 h-4" strokeWidth={2} />
                      Aprovechar oferta
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
