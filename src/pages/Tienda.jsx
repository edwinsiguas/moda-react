import { useState } from 'react';
import { ShoppingBag, Trash2, ArrowLeft, PackageX, Loader2 } from 'lucide-react';
import { useCarrito } from '../context/CarritoContext';
import { useToast }   from '../context/ToastContext';
import { Link }       from 'react-router-dom';
import { getProductById, patchProductStock } from '../services/api';

export default function Tienda() {
  const { carrito, eliminarProducto, limpiarCarrito, total } = useCarrito();
  const { showToast } = useToast();

  const handleEliminar = (i, nombre) => {
    if (confirm(`¿Eliminar "${nombre}" del carrito?`)) {
      eliminarProducto(i);
      showToast(`${nombre} eliminado del carrito`, 'info');
    }
  };

  const [comprando, setComprando] = useState(false);

  const handleComprar = async () => {
    if (carrito.length === 0) return;
    setComprando(true);
    try {
      const conteo = {};
      carrito.forEach((p) => {
        conteo[p.id] = (conteo[p.id] || 0) + 1;
      });

      for (const [id, cantidad] of Object.entries(conteo)) {
        try {
          const producto = await getProductById(id);
          const nuevoStock = Math.max(0, producto.stock - cantidad);
          await patchProductStock(id, nuevoStock);
        } catch (e) {
          console.error(`Error procesando producto ${id}`, e);
        }
      }
      
      limpiarCarrito();
      showToast('Compra realizada con éxito. Tu pedido está en camino.', 'success');
    } catch (e) {
      showToast('Hubo un error al procesar tu compra.', 'error');
    } finally {
      setComprando(false);
    }
  };

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="section-title text-3xl">Mi Carrito</h1>
            <p className="text-text-muted text-sm mt-1">
              {carrito.length} {carrito.length === 1 ? 'producto' : 'productos'}
            </p>
          </div>
          {carrito.length > 0 && (
            <button
              onClick={() => {
                if (confirm('¿Vaciar todo el carrito?')) {
                  limpiarCarrito();
                  showToast('Carrito vaciado', 'info');
                }
              }}
              className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors font-medium"
            >
              <Trash2 className="w-4 h-4" strokeWidth={2} /> Vaciar carrito
            </button>
          )}
        </div>

        {carrito.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl shadow-md">
            <PackageX className="w-16 h-16 text-text-muted/30 mx-auto mb-6" strokeWidth={1.5} />
            <h3 className="text-xl font-bold text-text-main mb-2">Tu carrito está vacío</h3>
            <p className="text-text-muted mb-8">Agrega productos para empezar a comprar</p>
            <Link to="/productos" className="btn-primary inline-flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" strokeWidth={2} /> Explorar Productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            
            <div className="lg:col-span-2 space-y-3">
              {carrito.map((producto, i) => (
                <div key={i}
                  className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-200 animate-fade-in-up">
                  <img src={producto.image} alt={producto.name}
                    className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-text-main truncate">{producto.name}</h4>
                    <p className="text-text-muted text-xs mt-0.5">{producto.category}</p>
                    <p className="text-primary font-extrabold text-lg mt-1">S/ {producto.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => handleEliminar(i, producto.name)}
                    id={`remove-${i}`}
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200 flex items-center justify-center"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                  </button>
                </div>
              ))}
            </div>

            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-md sticky top-24">
                <h3 className="font-bold text-text-main text-lg mb-4">Resumen</h3>

                <div className="space-y-2 mb-4 text-sm text-text-muted">
                  <div className="flex justify-between">
                    <span>Subtotal ({carrito.length} items)</span>
                    <span className="font-medium text-text-main">S/ {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span className="text-green-600 font-medium">Gratis</span>
                  </div>
                </div>

                <div className="divider" />

                <div className="flex justify-between items-center mb-5">
                  <span className="font-bold text-text-main">Total</span>
                  <span className="font-extrabold text-primary text-2xl">S/ {total.toFixed(2)}</span>
                </div>

                <button
                  onClick={handleComprar}
                  id="checkout-btn"
                  disabled={comprando}
                  className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {comprando 
                    ? <><Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} /> Procesando...</>
                    : <><ShoppingBag className="w-4 h-4" strokeWidth={2} /> Finalizar Compra</>
                  }
                </button>
                <Link to="/productos"
                  className="flex items-center justify-center gap-1 text-sm text-text-muted hover:text-primary mt-3 transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} /> Seguir comprando
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
