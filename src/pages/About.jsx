import { Users, Package, Star, ShoppingBag } from 'lucide-react';

const STATS = [
  { label: 'Categorías',  value: '12+',  Icon: Package    },
  { label: 'Productos',   value: '500+', Icon: ShoppingBag },
  { label: 'Clientas',    value: '8K+',  Icon: Users      },
  { label: 'Calificación', value: '4.9', Icon: Star       },
];

export default function About() {
  return (
    <div className="bg-background min-h-screen">

      
      <div className="bg-primary py-20 text-center">
        <h1 className="text-5xl font-extrabold text-white mb-4">Sobre Nosotras</h1>
        <p className="text-white/90 text-lg max-w-xl mx-auto">
          Somos una tienda de moda femenina dedicada a la elegancia, el estilo y la confianza.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <div>
            <h2 className="section-title mb-4">Nuestra Historia</h2>
            <p className="text-text-muted leading-relaxed mb-4">
              Fundada en Lima, Perú, <strong className="text-text-main">Moda y Estilo Única</strong> nació
              con la misión de ofrecer prendas de alta calidad que resalten la belleza y personalidad
              de cada mujer.
            </p>
            <p className="text-text-muted leading-relaxed mb-4">
              Trabajamos con diseñadores apasionados y materiales cuidadosamente seleccionados para
              garantizar que cada prenda sea una obra de arte accesible.
            </p>
            <p className="text-text-muted leading-relaxed">
              Nuestro catálogo incluye vestidos, blusas, pantalones, faldas, blazers, calzado y
              accesorios para toda ocasión.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {STATS.map(({ label, value, Icon }) => (
              <div key={label} className="bg-white rounded-2xl p-6 text-center shadow-md border border-primary/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <Icon className="w-8 h-8 text-primary mx-auto mb-2" strokeWidth={1.5} />
                <p className="text-3xl font-extrabold text-primary">{value}</p>
                <p className="text-text-muted text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
