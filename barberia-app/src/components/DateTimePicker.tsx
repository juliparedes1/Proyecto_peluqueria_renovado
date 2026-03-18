'use client';

import { useState, useEffect } from 'react';

interface DateTimePickerProps {
  onSelect: (date: string, time: string) => void;
  selectedDate: string | null;
  selectedTime: string | null;
}

interface Disponibilidad {
  diaSemana: number;
  nombreDia: string;
  estaAbierto: boolean;
  horaInicio: string;
  horaFin: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const allTimeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
];

function getNext14Days() {
  const dates: { fecha: string; diaSemana: number }[] = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      fecha: date.toISOString().split('T')[0],
      diaSemana: date.getDay(),
    });
  }
  return dates;
}

export default function DateTimePicker({ onSelect, selectedDate, selectedTime }: DateTimePickerProps) {
  const [disponibilidad, setDisponibilidad] = useState<Disponibilidad[]>([]);
  const [horasOcupadas, setHorasOcupadas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const daysWithInfo = getNext14Days();

  useEffect(() => {
    const fetchDisponibilidad = async () => {
      try {
        const res = await fetch(`${API_URL}/api/disponibilidad`);
        const data = await res.json();
        setDisponibilidad(data);
        
        await fetch(`${API_URL}/api/disponibilidad/inicializar`, { method: 'POST' });
      } catch (error) {
        console.error('Error fetching disponibilidad:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDisponibilidad();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const fetchHorasOcupadas = async () => {
        try {
          const res = await fetch(`${API_URL}/api/turnos/ocupadas/${selectedDate}`);
          const data = await res.json();
          setHorasOcupadas(data);
        } catch (error) {
          console.error('Error fetching horas ocupadas:', error);
        }
      };
      fetchHorasOcupadas();
    }
  }, [selectedDate]);

  const isDiaAbierto = (diaSemana: number): boolean => {
    const disp = disponibilidad.find(d => d.diaSemana === diaSemana);
    return disp ? disp.estaAbierto : false;
  };

  const handleDateClick = (date: string, diaSemana: number) => {
    if (isDiaAbierto(diaSemana)) {
      onSelect(date, selectedTime || '');
    }
  };

  const handleTimeClick = (time: string) => {
    if (selectedDate) {
      onSelect(selectedDate, time);
    }
  };

  const isHoraOcupada = (time: string): boolean => {
    return horasOcupadas.includes(time);
  };

  const getTimeSlotsForDate = (): string[] => {
    if (!selectedDate) return allTimeSlots;
    
    const dateObj = new Date(selectedDate + 'T00:00:00');
    const diaSemana = dateObj.getDay();
    const disp = disponibilidad.find(d => d.diaSemana === diaSemana);
    
    if (!disp || !disp.horaInicio || !disp.horaFin) return allTimeSlots;
    
    return allTimeSlots.filter(hora => hora >= disp.horaInicio && hora <= disp.horaFin);
  };

  const timeSlots = getTimeSlotsForDate();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Elegí día y horario</h2>
      
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Día</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {daysWithInfo.map(({ fecha, diaSemana }) => {
            const dateObj = new Date(fecha + 'T00:00:00');
            const dayName = dateObj.toLocaleDateString('es-AR', { weekday: 'short' });
            const dayNum = dateObj.getDate();
            const month = dateObj.toLocaleDateString('es-AR', { month: 'short' });
            const estaAbierto = isDiaAbierto(diaSemana);
            
            return (
              <button
                key={fecha}
                onClick={() => handleDateClick(fecha, diaSemana)}
                disabled={!estaAbierto}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedDate === fecha
                    ? 'border-black bg-gray-900 text-white'
                    : estaAbierto
                    ? 'border-gray-200 bg-white hover:border-gray-400'
                    : 'border-gray-100 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                }`}
              >
                <div className="text-sm capitalize">{dayName}</div>
                <div className="text-xl font-bold">{dayNum}</div>
                <div className="text-sm capitalize">{month}</div>
                {!estaAbierto && <div className="text-xs text-red-500">Cerrado</div>}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Horario</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {timeSlots.map((time) => {
              const ocupado = isHoraOcupada(time);
              return (
                <button
                  key={time}
                  onClick={() => handleTimeClick(time)}
                  disabled={ocupado}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedTime === time
                      ? 'border-black bg-gray-900 text-white'
                      : ocupado
                      ? 'border-gray-300 bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'border-gray-200 bg-white hover:border-gray-400'
                  }`}
                >
                  {time}
                  {ocupado && <div className="text-xs">Ocupado</div>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
