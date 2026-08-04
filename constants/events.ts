export type EventStatus =
  | 'Programado'
  | 'Activo'
  | 'Finalizado'
  | 'Cancelado';

export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  service: 'Desayuno' | 'Comida';
  people: number;
  location: string;
  observations: string;
  status: EventStatus;
}

export const events: Event[] = [
  {
    id: 1,
    title: 'Día del Trabajador',
    date: '25 Jul 2026',
    time: '13:00',
    service: 'Comida',
    people: 180,
    location: 'Comedor principal',
    observations: 'Servicio especial para todo el personal.',
    status: 'Activo',
  },
  {
    id: 2,
    title: 'Capacitación de Seguridad',
    date: '02 Ago 2026',
    time: '08:00',
    service: 'Desayuno',
    people: 65,
    location: 'Sala de capacitación',
    observations: 'Solo personal convocado.',
    status: 'Programado',
  },
  {
    id: 3,
    title: 'Cena Navideña',
    date: '20 Dic 2026',
    time: '19:00',
    service: 'Comida',
    people: 250,
    location: 'Comedor principal',
    observations: 'Evento anual.',
    status: 'Programado',
  },
  {
    id: 4,
    title: 'Cumpleaños del mes',
    date: '30 Jul 2026',
    time: '14:00',
    service: 'Comida',
    people: 95,
    location: 'Comedor principal',
    observations: 'Celebración mensual.',
    status: 'Finalizado',
  },
];