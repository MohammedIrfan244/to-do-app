export interface CreateCalendarEvent {
  title: string;
  description?: string;
  start: Date;
  end?: Date;
  type: 'event' | 'anniversary';
  color: string;
}

export interface UpdateCalendarEvent {
  id: string;
  title?: string;
  description?: string;
  start?: Date;
  end?: Date;
  type?: 'event' | 'anniversary';
  color?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end?: Date;
  type: 'event' | 'anniversary';
  color: string;
  createdAt: Date;
  updatedAt: Date;
}