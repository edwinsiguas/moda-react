import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Loader2, Search, SlidersHorizontal, ArrowRight, AlertCircle } from 'lucide-react';
import { getProducts }   from '../services/api';
import { useCarrito }      from '../context/CarritoContext';
import { useAuth }         from '../context/AuthContext';
import { useToast }        from '../context/ToastContext';

const CATEGORIAS = ['Todas', 'Vestidos', 'Blusas', 'Pantalones', 'Faldas', 'Blazers', 'Accesorios', 'Calzado'];

export default function Products() {
  const [products, setProducts]       = useState([]);
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
      .then((data) => { setProducts(data); setFiltered(data); setLoading(false); })
      .catch(() => { setError('No se pudieron cargar los productos. Asegúrate de que json-server está corriendo en el puerto 3000.'); setLoading(false); });
  }, []);

  useEffect(() => {
    const result = products.filter((p) => {
      const nombre = p.name.toLowerCase().includes(searchText.toLowerCase());
      const cat    = activeCategory === 'Todas' || p.category === activeCategory;
      return nombre && cat;
    });
    setFiltered(result);
  }, [searchText, activeCategory, products]);

  const handleAgregar = (product) => {
    if (!isLoggedIn) {
      showToast('Debes iniciar sesión para agregar al carrito', 'warning');
      navigate(`/login?redirect=${encodeURIComponent('/productos')}`);
      return;
    }
    agregarProducto(product);
    showToast(`${product.name} agregado al carrito`, 'success');
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-text-muted text-sm">Cargando productos...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-4" strokeWidth={1.5} />
      <p className="text-red-600 bg-red-50 border border-red-200 rounded-2xl p-6 text-sm">{error}</p>
    </div>
  );

  return (
    <div className="bg-background min-h-screen pb-20">

      
      <div className="bg-surface border-b border-primary/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="section-title text-4xl mb-2">Nuestros Productos</h1>
          <p className="text-text-muted max-w-md mx-auto">
            Descubre las últimas tendencias en moda femenina.{' '}
            <span className="text-primary font-semibold">{products.length} prendas</span> disponibles.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" strokeWidth={2} />
          <input
            id="search-products"
            type="text"
            placeholder="Buscar productos..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="input-field pl-11"
          />
        </div>

        
        <div className="flex items-center gap-2 flex-wrap mb-8">
          <SlidersHorizontal className="w-4 h-4 text-text-muted flex-shrink-0" strokeWidth={2} />
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`chip ${activeCategory === cat ? 'chip-active' : 'chip-inactive'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        
        <p className="text-text-muted text-sm mb-6">
          {filtered.length === 0
            ? 'Sin resultados'
            : `${filtered.length} ${filtered.length === 1 ? 'producto encontrado' : 'productos encontrados'}`}
        </p>

        
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-text-muted/40 mx-auto mb-4" strokeWidth={1.5} />
            <p className="text-text-muted mb-4">No se encontraron productos con esos filtros.</p>
            <button onClick={() => { setSearchText(''); setCategory('Todas'); }} className="btn-outline text-sm">
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onAgregar={handleAgregar} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product, onAgregar }) {
  const precioFinal = product.discount > 0
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-black/12 transition-all duration-300 hover:-translate-y-2 flex flex-col">
      <div className="relative overflow-hidden h-64">
        <img
          src={product.image} alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {product.discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow-lg">
            -{product.discount}%
          </span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
            Últimas {product.stock}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs font-semibold text-primary/70 uppercase tracking-wider mb-1">
          {product.category}
        </span>
        <h3 className="font-bold text-text-main text-base mb-2 leading-snug line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-primary font-extrabold text-xl">S/ {precioFinal.toFixed(2)}</span>
          {product.discount > 0 && (
            <span className="text-text-muted text-sm line-through">S/ {product.price.toFixed(2)}</span>
          )}
        </div>

        <button
          onClick={() => onAgregar(product)}
          id={`add-${product.id}`}
          className="btn-primary mt-auto text-sm py-2.5 w-full flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" strokeWidth={2} />
          Añadir al carrito
        </button>
      </div>
    </div>
  );
}
