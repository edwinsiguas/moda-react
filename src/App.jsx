import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CarritoProvider } from './context/CarritoContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Products from './pages/Products';
import Offers from './pages/Offers';
import Tienda from './pages/Tienda';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Contact from './pages/Contact';
import About from './pages/About';
import NotFound from './pages/NotFound';

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/productos" element={<Layout><Products /></Layout>} />
      <Route path="/ofertas" element={<Layout><Offers /></Layout>} />
      <Route path="/contacto" element={<Layout><Contact /></Layout>} />
      <Route path="/acerca" element={<Layout><About /></Layout>} />


      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />


      <Route
        path="/tienda"
        element={
          <ProtectedRoute requireAuth>
            <Layout><Tienda /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requireAuth>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        }
      />


      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAuth requireAdmin>
            <Layout><AdminPanel /></Layout>
          </ProtectedRoute>
        }
      />


      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CarritoProvider>
            <ToastContainer />
            <AppRoutes />
          </CarritoProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
