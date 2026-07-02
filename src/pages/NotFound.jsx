import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-background min-h-screen flex items-center">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">

          
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-9xl font-extrabold text-primary leading-none mb-4">404</h1>
            <h2 className="text-2xl font-bold text-text-main mb-4">Página no encontrada</h2>
            <p className="text-text-muted mb-8 leading-relaxed">
              La página que intentas visitar no existe o fue movida a otra ubicación.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/" className="btn-primary flex items-center justify-center gap-2">
                <Home className="w-4 h-4" strokeWidth={2} /> Volver al Inicio
              </Link>
              <Link to="/productos" className="btn-outline flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" strokeWidth={2} /> Ver Productos
              </Link>
            </div>
          </div>

          
          <div className="flex-1 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b"
              alt="Moda femenina"
              className="w-full max-w-sm rounded-3xl shadow-2xl object-cover max-h-96"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
