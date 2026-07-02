import { useState, useEffect } from 'react';
import { Package, Users, Tag, Plus, Trash2, Loader2, Shield, ShoppingBag, Edit2, Save } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { getProducts, getUsers, createProduct, updateProduct, deleteProduct as removeProduct } from '../services/api';

const CATEGORIAS   = ['Vestidos', 'Blusas', 'Pantalones', 'Faldas', 'Blazers', 'Accesorios', 'Calzado'];
const TABS = [
  { id: 'productos', label: 'Productos',        Icon: Package },
  { id: 'agregar',   label: 'Agregar Producto',  Icon: Plus    },
  { id: 'usuarios',  label: 'Usuarios',          Icon: Users   },
];
const emptyForm = { name: '', price: '', category: 'Vestidos', stock: '', discount: '0', image: '' };

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('productos');
  const [products, setProducts]   = useState([]);
  const [users,    setUsers]      = useState([]);
  const [form,     setForm]       = useState(emptyForm);
  const [loadingP, setLoadingP]   = useState(true);
  const [loadingU, setLoadingU]   = useState(true);
  const [saving,   setSaving]     = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { showToast }             = useToast();

  const loadProducts = () => {
    setLoadingP(true);
    getProducts()
      .then((d) => { setProducts(d); setLoadingP(false); })
      .catch(() => { showToast('Error al cargar productos', 'error'); setLoadingP(false); });
  };
  const loadUsers = () => {
    setLoadingU(true);
    getUsers()
      .then((d) => { setUsers(d); setLoadingU(false); })
      .catch(() => { showToast('Error al cargar usuarios', 'error'); setLoadingU(false); });
  };

  useEffect(() => { loadProducts(); loadUsers(); }, []);

  const handleGuardarProducto = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock || !form.image) {
      showToast('Completa todos los campos obligatorios', 'warning');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name:     form.name.trim(),
        price:    parseFloat(form.price),
        category: form.category,
        stock:    parseInt(form.stock),
        discount: parseInt(form.discount) || 0,
        image:    form.image.trim(),
      };
      
      let res;
      if (editingId) {
        res = await updateProduct(editingId, payload);
      } else {
        res = await createProduct(payload);
      }
      showToast(editingId ? `"${form.name}" actualizado` : `"${form.name}" agregado al catálogo`, 'success');
      setForm(emptyForm);
      setEditingId(null);
      loadProducts();
      setActiveTab('productos');
    } catch {
      showToast(editingId ? 'Error al actualizar el producto' : 'Error al agregar el producto', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      discount: product.discount,
      image: product.image
    });
    setEditingId(product.id);
    setActiveTab('agregar');
  };

  const handleEliminar = async (product) => {
    if (!confirm(`¿Eliminar "${product.name}" del catálogo?`)) return;
    try {
      await removeProduct(product.id);
      showToast(`"${product.name}" eliminado`, 'info');
      loadProducts();
    } catch {
      showToast('Error al eliminar el producto', 'error');
    }
  };

  const Spinner = () => (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 text-primary animate-spin" strokeWidth={2} />
    </div>
  );

  return (
    <div className="bg-background min-h-screen pb-20">

      
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-white mb-1 flex items-center gap-3">
            <Shield className="w-8 h-8" strokeWidth={2} /> Panel de Administración
          </h1>
          <p className="text-white/80">Gestiona productos y usuarios de Moda y Estilo Única</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Productos',  value: products.length,                                   Icon: Package,     color: 'text-primary'    },
            { label: 'Usuarios',   value: users.length,                                       Icon: Users,       color: 'text-amber-600'  },
            { label: 'En oferta',  value: products.filter((p) => p.discount > 0).length,     Icon: Tag,         color: 'text-red-500'    },
          ].map(({ label, value, Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-md text-center">
              <Icon className={`w-8 h-8 mx-auto mb-2 ${color}`} strokeWidth={1.5} />
              <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
              <p className="text-text-muted text-sm">{label}</p>
            </div>
          ))}
        </div>

        
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1.5 shadow-sm w-fit">
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => {
              if (id === 'agregar') { setForm(emptyForm); setEditingId(null); }
              setActiveTab(id);
            }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === id ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-text-main'
              }`}>
              <Icon className="w-4 h-4" strokeWidth={2} /> 
              {id === 'agregar' && editingId ? 'Editar Producto' : label}
            </button>
          ))}
        </div>

        
        {activeTab === 'productos' && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            {loadingP ? <Spinner /> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-background">
                    <tr>
                      {['Producto', 'Categoría', 'Precio', 'Stock', 'Descuento', 'Acciones'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-primary/3 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                            <span className="font-medium text-text-main">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-text-muted">{p.category}</td>
                        <td className="px-4 py-3 font-semibold text-primary">S/ {p.price.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={`font-semibold ${p.stock <= 5 ? 'text-amber-500' : 'text-green-600'}`}>{p.stock}</span>
                        </td>
                        <td className="px-4 py-3">
                          {p.discount > 0
                            ? <span className="inline-flex items-center gap-1 bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full text-xs">
                                <Tag className="w-3 h-3" strokeWidth={2} /> -{p.discount}%
                              </span>
                            : <span className="text-text-muted">—</span>}
                        </td>
                        <td className="px-4 py-3 flex gap-2">
                          <button onClick={() => handleEdit(p)}
                            className="inline-flex items-center gap-1.5 text-xs text-blue-500 hover:text-white hover:bg-blue-500 border border-blue-200 hover:border-blue-500 px-3 py-1.5 rounded-lg transition-all duration-200 font-medium">
                            <Edit2 className="w-3.5 h-3.5" strokeWidth={2} /> Editar
                          </button>
                          <button onClick={() => handleEliminar(p)}
                            className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-white hover:bg-red-500 border border-red-200 hover:border-red-500 px-3 py-1.5 rounded-lg transition-all duration-200 font-medium">
                            <Trash2 className="w-3.5 h-3.5" strokeWidth={2} /> Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        
        {activeTab === 'agregar' && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-2xl p-8 shadow-md">
              <h2 className="text-xl font-bold text-text-main mb-6 flex items-center gap-2">
                {editingId ? <Edit2 className="w-5 h-5 text-primary" strokeWidth={2} /> : <Plus className="w-5 h-5 text-primary" strokeWidth={2} />} 
                {editingId ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <form onSubmit={handleGuardarProducto} className="space-y-5" id="add-product-form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-main mb-1.5">Nombre *</label>
                    <input id="prod-nombre" type="text" value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Ej: Vestido Primavera" className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-main mb-1.5">Categoría *</label>
                    <select id="prod-categoria" value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="select-field">
                      {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-main mb-1.5">Precio (S/) *</label>
                    <input id="prod-precio" type="number" step="0.01" min="0" value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="89.90" className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-main mb-1.5">Stock *</label>
                    <input id="prod-stock" type="number" min="0" value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      placeholder="10" className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-main mb-1.5">Descuento (%)</label>
                    <input id="prod-descuento" type="number" min="0" max="99" value={form.discount}
                      onChange={(e) => setForm({ ...form, discount: e.target.value })}
                      placeholder="0" className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1.5">URL de imagen *</label>
                  <input id="prod-imagen" type="url" value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://ejemplo.com/imagen.jpg" className="input-field" required />
                </div>

                
                {form.image && (
                  <div className="flex items-center gap-4 p-3 bg-background rounded-xl">
                    <img src={form.image} alt="Preview" className="w-16 h-16 object-cover rounded-xl"
                      onError={(e) => e.target.style.display = 'none'} />
                    <div>
                      <p className="font-semibold text-sm text-text-main">{form.name || 'Nombre del producto'}</p>
                      <p className="text-primary font-bold text-sm">
                        S/ {form.price ? parseFloat(form.price).toFixed(2) : '0.00'}
                        {parseInt(form.discount) > 0 && (
                          <span className="ml-2 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                            -{form.discount}%
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving}
                    className="btn-primary flex-1 py-3 disabled:opacity-60 flex items-center justify-center gap-2">
                    {saving
                      ? <><Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} /> Guardando...</>
                      : editingId 
                        ? <><Save className="w-4 h-4" strokeWidth={2} /> Guardar Cambios</>
                        : <><Plus className="w-4 h-4" strokeWidth={2} /> Agregar Producto</>
                    }
                  </button>
                  <button type="button" onClick={() => { setForm(emptyForm); setEditingId(null); }}
                    className="btn-ghost border border-gray-200 px-6">
                    {editingId ? 'Cancelar' : 'Limpiar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        
        {activeTab === 'usuarios' && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            {loadingU ? <Spinner /> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-background">
                    <tr>
                      {['Usuario', 'Correo', 'Rol', 'Registro'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-primary/3 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                              {u.nombre.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)}
                            </div>
                            <span className="font-medium text-text-main">{u.nombre}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-text-muted">{u.correo}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            u.rol === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {u.rol === 'admin'
                              ? <><Shield className="w-3 h-3" strokeWidth={2} /> Admin</>
                              : <><ShoppingBag className="w-3 h-3" strokeWidth={2} /> Cliente</>
                            }
                          </span>
                        </td>
                        <td className="px-4 py-3 text-text-muted">
                          {new Date(u.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
