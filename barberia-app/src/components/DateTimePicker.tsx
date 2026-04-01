'use client';

import { useState, useEffect } from 'react';

interface DateTimePickerProps {
  onSelect: (date: string, time: string) => void;
  selectedDate: string | null;
  selectedTime: string | null;
  salonId: number;
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
  for (let i = 0; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      fecha: date.toISOString().split('T')[0],
      diaSemana: date.getDay(),
    });
  }
  return dates;
}

export default function DateTimePicker({ onSelect, selectedDate, selectedTime, salonId }: DateTimePickerProps) {
  const [disponibilidad, setDisponibilidad] = useState<Disponibilidad[]>([]);
  const [horasOcupadas, setHorasOcupadas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const daysWithInfo = getNext14Days();

  useEffect(() => {
    const fetchDisponibilidad = async () => {
      try {
        const res = await fetch(`${API_URL}/api/salon/${salonId}/disponibilidad`);
        const data = await res.json();
        setDisponibilidad(data);
      } catch (error) {
        console.error('Error fetching disponibilidad:', error);
      } finally {
        setLoading(false);
      }
    };
    if (salonId) {
      fetchDisponibilidad();
    }
  }, [salonId]);

  useEffect(() => {
    if (selectedDate && salonId) {
      const fetchHorasOcupadas = async () => {
        try {
          const res = await fetch(`${API_URL}/api/turnos/ocupadas/${selectedDate}?salonId=${salonId}`);
          const data = await res.json();
          setHorasOcupadas(data);
        } catch (error) {
          console.error('Error fetching horas ocupadas:', error);
        }
      };
      fetchHorasOcupadas();
    }
  }, [selectedDate, salonId]);

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
  <h2 className="text-2xl font-bold text-gray-900">Elegí día y horario</h2>
  
  <div>
    <h3 className="text-lg font-semibold text-gray-800 mb-3">Día</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {daysWithInfo.map(({ fecha, diaSemana }) => {
        const dateObj = new Date(fecha + 'T00:00:00');
        const dayName = dateObj.toLocaleDateString('es-AR', { weekday: 'short' });
        const dayNum = dateObj.getDate();
        const month = dateObj.toLocaleDateString('es-AR', { month: 'short' });
        const estaAbierto = isDiaAbierto(diaSemana);
        const seleccionado = selectedDate === fecha;
        
        return (
          <button
            key={fecha}
            onClick={() => handleDateClick(fecha, diaSemana)}
            disabled={!estaAbierto}
            className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center ${
              seleccionado
                ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-600 ring-offset-1' 
                : estaAbierto
                ? 'border-gray-400 bg-white text-gray-800 hover:border-black hover:bg-gray-50'
                : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-40'
            }`}
          >
            <span className={`text-xs font-bold uppercase ${seleccionado ? 'text-blue-700' : 'text-gray-500'}`}>
              {dayName}
            </span>
            <span className="text-2xl font-black">{dayNum}</span>
            <span className="text-sm font-medium capitalize">{month}</span>
            {!estaAbierto && <span className="text-[10px] font-bold text-red-500 mt-1">CERRADO</span>}
          </button>
        );
      })}
    </div>
  </div>

  {selectedDate && (
    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Horario disponible</h3>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {timeSlots.map((time) => {
          const ocupado = isHoraOcupada(time);
          const seleccionado = selectedTime === time;
          return (
            <button
              key={time}
              onClick={() => handleTimeClick(time)}
              disabled={ocupado}
              className={`p-3 rounded-lg border-2 font-bold transition-all ${
                seleccionado
                  ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                  : ocupado
                  ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                  : 'border-gray-400 bg-white text-gray-900 hover:border-black'
              }`}
            >
              {time}
              {ocupado && <div className="text-[9px] uppercase tracking-tighter">Ocupado</div>}
            </button>
          );
        })}
      </div>
    </div>
  )}
</div>
  );
}