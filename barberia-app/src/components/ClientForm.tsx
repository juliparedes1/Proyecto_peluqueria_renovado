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
   <div className="space-y-6 bg-white p-4 rounded-xl">
  <h2 className="text-2xl font-black text-gray-900 border-b-2 border-gray-100 pb-2">Tus datos</h2>
  <form onSubmit={handleSubmit} className="space-y-5">
    <div>
      <label className="block text-sm font-bold text-gray-800 mb-1.5">
        Nombre completo *
      </label>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        className="w-full p-3.5 border-2 border-gray-400 rounded-lg text-gray-900 font-medium placeholder:text-gray-500 focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all bg-white"
        placeholder="Ej: Juan Pérez"
      />
    </div>

    <div>
      <label className="block text-sm font-bold text-gray-800 mb-1.5">
        Teléfono *
      </label>
      <input
        type="tel"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        required
        className="w-full p-3.5 border-2 border-gray-400 rounded-lg text-gray-900 font-medium placeholder:text-gray-500 focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all bg-white"
        placeholder="11 1234 5678"
      />
    </div>

    <div>
      <label className="block text-sm font-bold text-gray-800 mb-1.5">
        Email *
      </label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-3.5 border-2 border-gray-400 rounded-lg text-gray-900 font-medium placeholder:text-gray-500 focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all bg-white"
        placeholder="juan@email.com"
      />
    </div>

    <button
      type="submit"
      disabled={isSubmitting || !isValid}
      className="w-full bg-gray-900 text-white py-4 rounded-lg font-black text-xl hover:bg-black active:scale-[0.98] transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed mt-4"
    >
      {isSubmitting ? 'PROCESANDO...' : 'CONFIRMAR TURNO'}
    </button>
  </form>
</div>
  );
}
