'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface Salon {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  ubicacion: string;
  estaActivo: boolean;
  fechaCreacion: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function SuperAdminPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [salones, setSalones] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    ubicacion: '',
  });

  useEffect(() => {
    if (!user || user.rol !== 'SUPER_ADMIN') {
      router.push('/login');
      return;
    }
    fetchSalones();
  }, [user, router]);

  const fetchSalones = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/salons`);
      if (res.ok) {
        const data = await res.json();
        setSalones(data);
      }
    } catch (error) {
      console.error('Error fetching salones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/admin/salons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        setFormData({ nombre: '', email: '', telefono: '', ubicacion: '' });
        fetchSalones();
      } else {
        alert('Error al crear el salón');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este salón?')) return;
    
    try {
      const res = await fetch(`${API_URL}/api/admin/salons/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchSalones();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-900 text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">SUPER ADMIN</h1>
            <p className="text-gray-400 text-sm">Gestión de Peluquerías</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">{user?.nombre}</span>
            <button
              onClick={() => { logout(); router.push('/login'); }}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-semibold"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Peluquerías Registradas</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            + Nueva Peluquería
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {salones.map((salon) => (
            <div key={salon.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  {salon.nombre.charAt(0)}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  salon.estaActivo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {salon.estaActivo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{salon.nombre}</h3>
              <div className="text-sm text-gray-600 space-y-1 mb-4">
                <p>📧 {salon.email}</p>
                <p>📞 {salon.telefono}</p>
                <p>📍 {salon.ubicacion}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(salon.id)}
                  className="flex-1 bg-red-100 text-red-700 py-2 rounded-lg text-sm font-semibold hover:bg-red-200"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {salones.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay peluquerías registradas</p>
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Nueva Peluquería</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Ubicación</label>
                  <input
                    type="text"
                    value={formData.ubicacion}
                    onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}