import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { servicio, precio, fecha, hora, nombre, telefono } = body;

    if (!servicio || !precio || !fecha || !hora || !nombre || !telefono) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    const stmt = db.prepare(
      'INSERT INTO turnos (servicio, precio, fecha, hora, nombre, telefono) VALUES (?, ?, ?, ?, ?, ?)'
    );
    
    const result = stmt.run(servicio, precio, fecha, hora, nombre, telefono);

    return NextResponse.json({ 
      success: true, 
      id: result.lastInsertRowid 
    });
  } catch (error) {
    console.error('Error guardando turno:', error);
    return NextResponse.json(
      { error: 'Error al guardar el turno' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const stmt = db.prepare('SELECT * FROM turnos ORDER BY fecha, hora');
    const turnos = stmt.all();
    return NextResponse.json(turnos);
  } catch (error) {
    console.error('Error obteniendo turnos:', error);
    return NextResponse.json(
      { error: 'Error al obtener los turnos' },
      { status: 500 }
    );
  }
}
