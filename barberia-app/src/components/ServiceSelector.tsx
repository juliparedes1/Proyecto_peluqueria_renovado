'use client';

import { useState } from 'react';

interface Service {
  id: string;
  name: string;
  price: number;
}

const services: Service[] = [
  { id: 'corte', name: 'Corte de pelo', price: 2500 },
  { id: 'corte-barba', name: 'Corte + Barba', price: 3500 },
];

interface ServiceSelectorProps {
  onSelect: (service: Service) => void;
  selectedService: Service | null;
}

export default function ServiceSelector({ onSelect, selectedService }: ServiceSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Seleccioná tu servicio</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => onSelect(service)}
            className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
              selectedService?.id === service.id
                ? 'border-black bg-gray-900 text-white shadow-lg'
                : 'border-gray-200 bg-white hover:border-gray-400 hover:shadow-md'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className={`text-lg font-semibold ${selectedService?.id === service.id ? 'text-white' : 'text-gray-800'}`}>
                {service.name}
              </span>
              <span className={`text-2xl font-bold ${selectedService?.id === service.id ? 'text-yellow-400' : 'text-gray-900'}`}>
                ${service.price}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
