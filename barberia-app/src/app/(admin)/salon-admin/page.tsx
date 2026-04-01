'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface Servicio {
  id: number;
  nombre: string;
  precio: number;
  duracionMinutos: number;
  estaActivo: boolean;
}

interface Disponibilidad {
  id: number;
  diaSemana: number;
  nombreDia: string;
  estaAbierto: boolean;
  horaInicio: string;
  horaFin: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function SalonAdminPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'servicios' | 'disponibilidad'>('servicios');
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [disponibilidad, setDisponibilidad] = useState<Disponibilidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Servicio | null>(null);
  const [formData, setFormData] = useState({ nombre: '', precio: 0, duracionMinutos: 30 });

  const salonId = user?.salonId || 1;

  useEffect(() => {
    if (!user || user.rol !== 'SALON_ADMIN') {
      router.push('/login');
      return;
    }
    fetchData();
  }, [user, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [serviciosRes, disponibilidadRes] = await Promise.all([
        fetch(`${API_URL}/api/salon/${salonId}/servicios`),
        fetch(`${API_URL}/api/salon/${salonId}/disponibilidad`),
      ]);

      if (serviciosRes.ok) {
        setServicios(await serviciosRes.json());
      }
      if (disponibilidadRes.ok) {
        setDisponibilidad(await disponibilidadRes.json());
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitServicio = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingService 
      ? `${API_URL}/api/salon/${salonId}/servicios/${editingService.id}`
      : `${API_URL}/api/salon/${salonId}/servicios`;
    
    const method = editingService ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        setEditingService(null);
        setFormData({ nombre: '', precio: 0, duracionMinutos: 30 });
        fetchData();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteServicio = async (id: number) => {
    if (!confirm('¿Eliminar este servicio?')) return;
    
    try {
      await fetch(`${API_URL}/api/salon/${salonId}/servicios/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDisponibilidadChange = async (dia: number, field: string, value: any) => {
    const updated = disponibilidad.map(d => 
      d.diaSemana === dia ? { ...d, [field]: value } : d
    );
    setDisponibilidad(updated);

    try {
      await fetch(`${API_URL}/api/salon/${salonId}/disponibilidad`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
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
            <h1 className="text-xl font-bold">ADMINISTRACIÓN</h1>
            <p className="text-gray-400 text-sm">Gestión de tu Peluquería</p>
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

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('servicios')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'servicios' 
                ? 'bg-gray-900 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-200'
            }`}
          >
            Servicios
          </button>
          <button
            onClick={() => setActiveTab('disponibilidad')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'disponibilidad' 
                ? 'bg-gray-900 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-200'
            }`}
          >
            Horarios
          </button>
        </div>

        {activeTab === 'servicios' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Catálogo de Servicios</h2>
              <button
                onClick={() => { setEditingService(null); setFormData({ nombre: '', precio: 0, duracionMinutos: 30 }); setShowModal(true); }}
                className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800"
              >
                + Nuevo Servicio
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Servicio</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Precio</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Duración</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Estado</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {servicios.map((servicio) => (
                    <tr key={servicio.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-800 font-medium">{servicio.nombre}</td>
                      <td className="px-6 py-4 text-gray-800">${servicio.precio}</td>
                      <td className="px-6 py-4 text-gray-600">{servicio.duracionMinutos} min</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          servicio.estaActivo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {servicio.estaActivo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => { setEditingService(servicio); setFormData({ nombre: servicio.nombre, precio: servicio.precio, duracionMinutos: servicio.duracionMinutos }); setShowModal(true); }}
                          className="text-blue-600 hover:text-blue-800 mr-4 font-semibold"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteServicio(servicio.id)}
                          className="text-red-600 hover:text-red-800 font-semibold"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {servicios.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No hay servicios registrados
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'disponibilidad' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Horario de Atención</h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="grid gap-4">
                {disponibilidad.map((dia) => (
                  <div key={dia.diaSemana} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-32 font-semibold text-gray-800">{dia.nombreDia}</div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={dia.estaAbierto}
                        onChange={(e) => handleDisponibilidadChange(dia.diaSemana, 'estaAbierto', e.target.checked)}
                        className="w-5 h-5"
                      />
                      <span className="text-gray-700">Abierto</span>
                    </label>
                    {dia.estaAbierto && (
                      <div className="flex items-center gap-2 ml-4">
                        <input
                          type="time"
                          value={dia.horaInicio || ''}
                          onChange={(e) => handleDisponibilidadChange(dia.diaSemana, 'horaInicio', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <span className="text-gray-500">a</span>
                        <input
                          type="time"
                          value={dia.horaFin || ''}
                          onChange={(e) => handleDisponibilidadChange(dia.diaSemana, 'horaFin', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
            </h3>
            <form onSubmit={handleSubmitServicio}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Servicio</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Precio ($)</label>
                  <input
                    type="number"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Duración (minutos)</label>
                  <input
                    type="number"
                    value={formData.duracionMinutos}
                    onChange={(e) => setFormData({ ...formData, duracionMinutos: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingService(null); }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800"
                >
                  {editingService ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}