import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';

const categorias = [
  { nombre: 'Vestidos',    imagen: 'https://media.falabella.com/falabellaPE/135742371_01/w=1500,h=1500,fit=cover' },
  { nombre: 'Blusas',      imagen: 'https://media.falabella.com/falabellaPE/883505011_1/w=1500,h=1500,fit=cover' },
  { nombre: 'Accesorios',  imagen: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1' },
];

export default function Home() {
  return (
    <>
      
      <section className="bg-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 min-h-[60vh]">

            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-5xl lg:text-6xl font-extrabold text-primary leading-tight mb-6">
                Moda y<br />Estilo Única
              </h1>
              <p className="text-lg text-text-muted mb-8 max-w-md leading-relaxed">
                Descubre prendas diseñadas para resaltar tu personalidad y elegancia.
              </p>
              <Link to="/productos" className="btn-primary inline-flex items-center gap-2 text-base">
                Ver Colección <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </Link>
            </div>

            <div className="flex-1 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1496747611176-843222e1e57c"
                alt="Moda femenina"
                className="w-full max-w-md rounded-3xl shadow-2xl object-cover max-h-[520px]"
              />
            </div>
          </div>
        </div>
      </section>

      
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Categorías Destacadas</h2>
            <p className="text-text-muted mt-2">Encuentra tu estilo en nuestra selección</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categorias.map((cat) => (
              <Link to="/productos" key={cat.nombre} className="card group cursor-pointer block">
                <div className="overflow-hidden">
                  <img
                    src={cat.imagen} alt={cat.nombre}
                    className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 text-center">
                  <h5 className="font-semibold text-lg text-text-main">{cat.nombre}</h5>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      
      <section className="bg-primary py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Nueva Colección Primavera</h2>
          <p className="text-white/90 text-lg mb-8">
            Obtén hasta 20% de descuento en productos seleccionados.
          </p>
          <Link to="/ofertas"
            className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-3 rounded-xl hover:bg-background transition-colors duration-200">
            Ver Ofertas <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </Link>
        </div>
      </section>
    </>
  );
}
