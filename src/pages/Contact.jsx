import { useState } from 'react';
import { MapPin, Phone, Mail, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [form, setForm]     = useState({ nombre: '', correo: '', asunto: '', mensaje: '' });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviado(true);
    setForm({ nombre: '', correo: '', asunto: '', mensaje: '' });
    setTimeout(() => setEnviado(false), 5000);
  };

  return (
    <div className="bg-background min-h-screen">

      
      <div className="bg-background py-16 text-center border-b border-primary/10">
        <h1 className="section-title text-4xl">Contáctanos</h1>
        <p className="text-text-muted mt-2">Estamos aquí para ayudarte con cualquier consulta.</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          
          <div className="lg:col-span-3 bg-white rounded-2xl p-8 shadow-md border border-primary/10">
            <h3 className="text-xl font-semibold text-text-main mb-6">Envíanos un mensaje</h3>

            <form onSubmit={handleSubmit} className="space-y-5" id="contact-form">
              <div>
                <label className="block text-sm font-semibold text-text-main mb-1.5">Nombre</label>
                <input id="contact-nombre" type="text" name="nombre" value={form.nombre}
                  onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-main mb-1.5">Correo electrónico</label>
                <input id="contact-correo" type="email" name="correo" value={form.correo}
                  onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-main mb-1.5">Asunto</label>
                <input id="contact-asunto" type="text" name="asunto" value={form.asunto}
                  onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-main mb-1.5">Mensaje</label>
                <textarea id="contact-mensaje" name="mensaje" value={form.mensaje}
                  onChange={handleChange} rows={5} required
                  className="input-field resize-none" />
              </div>

              <button type="submit" id="contact-submit"
                className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                <Send className="w-4 h-4" strokeWidth={2} /> Enviar Mensaje
              </button>

              {enviado && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-green-500" strokeWidth={2} />
                  Mensaje enviado correctamente. Te contactaremos pronto.
                </div>
              )}
            </form>
          </div>

          
          <div className="lg:col-span-2 bg-white rounded-2xl overflow-hidden shadow-md border border-primary/10">
            <img
              src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80"
              alt="Moda femenina" className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="font-bold text-lg text-primary mb-2">Moda y Estilo Única</h3>
              <p className="text-text-muted text-sm mb-5">
                Estamos listas para ayudarte a encontrar el look perfecto.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-text-muted">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={2} />
                  Lima, Perú
                </li>
                <li className="flex items-center gap-3 text-sm text-text-muted">
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={2} />
                  +51 963 852 741
                </li>
                <li className="flex items-center gap-3 text-sm text-text-muted">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={2} />
                  contacto@modayestilo.com
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
