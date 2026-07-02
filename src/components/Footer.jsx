import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/productos', label: 'Productos' },
  { to: '/ofertas', label: 'Ofertas' },
  { to: '/tienda', label: 'Tienda' },
];

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-primary/10 pt-14 pb-6 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          
          <div>
            <h4 className="text-primary font-bold text-xl mb-3">
              Moda y Estilo Única
            </h4>
            <p className="text-text-muted text-sm leading-relaxed">
              Elegancia, estilo y confianza en cada prenda.
            </p>
          </div>

          
          <div>
            <h5 className="text-primary font-semibold mb-4">Navegación</h5>
            <ul className="space-y-2">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-text-muted text-sm hover:text-primary transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          
          <div>
            <h5 className="text-primary font-semibold mb-4">Contacto</h5>
            <ul className="space-y-3 text-text-muted text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" strokeWidth={2} />
                Lima, Perú
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" strokeWidth={2} />
                +51 987 654 321
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" strokeWidth={2} />
                contacto@modaunica.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/10 pt-6 text-center">
          <p className="text-text-muted text-sm">
            © 2026 Moda y Estilo Única — Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}
