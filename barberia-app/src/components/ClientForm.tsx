'use client';

import { useState } from 'react';

interface ClientFormProps {
  onSubmit: (nombre: string, telefono: string, email: string) => void;
  isSubmitting: boolean;
}

export default function ClientForm({ onSubmit, isSubmitting }: ClientFormProps) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre.trim() && telefono.trim() && email.trim()) {
      onSubmit(nombre, telefono, email);
    }
  };

  const isValid = nombre.trim() && telefono.trim() && email.trim() && email.includes('@');

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Tus datos</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo *
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
            placeholder="Juan Pérez"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono *
          </label>
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
            placeholder="11 1234 5678"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
            placeholder="juan@email.com"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="w-full bg-gray-900 text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Reservando...' : 'Confirmar turno'}
        </button>
      </form>
    </div>
  );
}
