'use client';

interface Service {
  id: number;
  nombre: string;
  precio: number;
  duracionMinutos: number;
}

interface ServiceSelectorProps {
  onSelect: (service: Service) => void;
  selectedService: Service | null;
  servicios: Service[];
}

export default function ServiceSelector({ onSelect, selectedService, servicios }: ServiceSelectorProps) {
  const servicesToShow = servicios.length > 0 ? servicios : [
    { id: 1, nombre: 'Corte de pelo', precio: 2500, duracionMinutos: 30 },
    { id: 2, nombre: 'Corte + Barba', precio: 3500, duracionMinutos: 45 },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Seleccioná tu servicio</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {servicesToShow.map((service) => (
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
                {service.nombre}
              </span>
              <span className={`text-2xl font-bold ${selectedService?.id === service.id ? 'text-yellow-400' : 'text-gray-900'}`}>
                ${service.precio}
              </span>
            </div>
            <div className={`text-sm mt-2 ${selectedService?.id === service.id ? 'text-gray-300' : 'text-gray-500'}`}>
              Duración: {service.duracionMinutos} minutos
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}