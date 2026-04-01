'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(email, password);

    if (success) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.rol === 'SUPER_ADMIN') {
        router.push('/superadmin');
      } else if (user.rol === 'SALON_ADMIN') {
        router.push('/salon-admin');
      }
    } else {
      setError('Credenciales incorrectas');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="bg-gray-900 rounded-t-2xl p-8 text-center">
          <h1 className="text-3xl font-bold text-white">BARBERÍA</h1>
          <p className="text-gray-400 mt-2">Panel de Administración</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Usuario / Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
              placeholder="Ingresa tu usuario"
              required
            />
          </div>
          
          <div className="mb-8">
            <label className="block text-gray-700 font-semibold mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'INGRESAR'}
          </button>
          
          <div className="mt-6 text-center">
            <a href="/" className="text-gray-500 hover:text-gray-700 text-sm">
              ← Volver al inicio
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}