'use client';

import { useState } from 'react';
import ServiceSelector from '@/components/ServiceSelector';
import DateTimePicker from '@/components/DateTimePicker';
import ClientForm from '@/components/ClientForm';

interface Service {
  id: string;
  name: string;
  price: number;
}

type Step = 'service' | 'datetime' | 'client' | 'success';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function Home() {
  const [step, setStep] = useState<Step>('service');
  const [service, setService] = useState<Service | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleServiceSelect = (selected: Service) => {
    setService(selected);
  };

  const handleDateTimeSelect = (selectedDate: string, selectedTime: string) => {
    setDate(selectedDate);
    setTime(selectedTime);
  };

  const handleContinue = () => {
    if (service && step === 'service') {
      setStep('datetime');
    } else if (service && date && time && step === 'datetime') {
      setStep('client');
    }
  };

  const handleClientSubmit = async (nombre: string, telefono: string, email: string) => {
    if (!service || !date || !time) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/turnos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          servicio: service.name,
          precio: service.price,
          fecha: date,
          hora: time,
          nombre,
          telefono,
          email,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStep('success');
      } else {
        alert(data.error || 'Error al guardar el turno');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el turno. Verifica que el servidor esté funcionando.');
    } finally {
      setIsSubmitting(false);
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

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Turno reservado!</h1>
          <p className="text-gray-600 mb-4">
            Tu turno ha sido confirmado para el <br/>
            <span className="font-semibold">{date && formatDate(date)}</span> a las <span className="font-semibold">{time}</span>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Se ha enviado un email de confirmación con el enlace para cancelar tu turno.
          </p>
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Servicio</p>
            <p className="font-semibold text-gray-900">{service?.name}</p>
            <p className="font-bold text-lg text-gray-900">${service?.price}</p>
          </div>
          <button
            onClick={() => {
              setStep('service');
              setService(null);
              setDate(null);
              setTime(null);
            }}
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Reservar otro turno
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white py-6 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold">BARBERÍA</h1>
          <p className="text-gray-400">Reservá tu turno online</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          {['service', 'datetime', 'client'].map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                step === s ? 'bg-gray-900 text-white' :
                ['service', 'datetime', 'client'].indexOf(step) > i ? 'bg-green-600 text-white' :
                'bg-gray-200 text-gray-500'
              }`}>
                {['service', 'datetime', 'client'].indexOf(step) > i ? '✓' : i + 1}
              </div>
              {i < 2 && <div className={`w-12 md:w-24 h-1 ${['service', 'datetime', 'client'].indexOf(step) > i ? 'bg-green-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          {step === 'service' && (
            <>
              <ServiceSelector onSelect={handleServiceSelect} selectedService={service} />
              <button
                onClick={handleContinue}
                disabled={!service}
                className="w-full mt-8 bg-gray-900 text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar
              </button>
            </>
          )}

          {step === 'datetime' && (
            <>
              <DateTimePicker 
                onSelect={handleDateTimeSelect} 
                selectedDate={date} 
                selectedTime={time} 
              />
              <button
                onClick={handleContinue}
                disabled={!date || !time}
                className="w-full mt-8 bg-gray-900 text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar
              </button>
            </>
          )}

          {step === 'client' && (
            <>
              <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Resumen del turno</h3>
                <p className="text-gray-600">{service?.name} - ${service?.price}</p>
                <p className="text-gray-600">{date && formatDate(date)} a las {time}</p>
              </div>
              <ClientForm onSubmit={handleClientSubmit} isSubmitting={isSubmitting} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
