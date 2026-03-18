'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface TurnoInfo {
  success: boolean;
  servicio?: string;
  fecha?: string;
  hora?: string;
  nombre?: string;
  precio?: number;
  error?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

function CancelarContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [turno, setTurno] = useState<TurnoInfo | null>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [cancelando, setCancelando] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (token) {
      fetchTurnoInfo();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchTurnoInfo = async () => {
    try {
      const res = await fetch(`${API_URL}/api/turnos/token/${token}`);
      const data = await res.json();
      setTurno(data);
    } catch (error) {
      setTurno({ success: false, error: 'Error al cargar el turno' });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const dateObj = new Date(dateStr + 'T00:00:00');
    return dateObj.toLocaleDateString('es-AR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const handleCancelar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !email) return;

    setCancelando(true);
    try {
      const res = await fetch(`${API_URL}/api/turnos/cancelar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email }),
      });

      const data = await res.json();
      setResult({
        success: data.success,
        message: data.message || data.error,
      });
    } catch (error) {
      setResult({
        success: false,
        message: 'Error al procesar la cancelación',
      });
    } finally {
      setCancelando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Cancelar Turno</h1>
          <p className="text-gray-600">El enlace de cancelación no es válido.</p>
        </div>
      </div>
    );
  }

  if (!turno?.success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Turno no encontrado</h1>
          <p className="text-gray-600">El turno puede haber sido cancelado o no existe.</p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            result.success ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {result.success ? (
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {result.success ? 'Turno Cancelado' : 'Error'}
          </h1>
          <p className="text-gray-600 mb-6">{result.message}</p>
          <a
            href="/"
            className="inline-block w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Cancelar Turno</h1>
        <p className="text-gray-600 mb-6">
          Ingresá tu email para confirmar la cancelación del turno.
        </p>

        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-gray-700 mb-2">Detalles del turno</h2>
          <p className="text-gray-600"><span className="font-medium">Servicio:</span> {turno.servicio}</p>
          <p className="text-gray-600"><span className="font-medium">Fecha:</span> {turno.fecha && formatDate(turno.fecha)}</p>
          <p className="text-gray-600"><span className="font-medium">Hora:</span> {turno.hora}</p>
          <p className="text-gray-600"><span className="font-medium">Precio:</span> ${turno.precio}</p>
        </div>

        <form onSubmit={handleCancelar}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tu email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
              placeholder="tu@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={cancelando || !email}
            className="w-full bg-red-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelando ? 'Cancelando...' : 'Confirmar Cancelación'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <a href="/" className="text-gray-500 hover:text-gray-700 text-sm">
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}

export default function CancelarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    }>
      <CancelarContent />
    </Suspense>
  );
}
