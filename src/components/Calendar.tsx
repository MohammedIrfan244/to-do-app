"use client";

import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import { Plus, X, Calendar, Gift, Trash2, Clock } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getEvents, createEvent, updateEvent, deleteEvent } from '@/server/calendar-actions';

const localizer = momentLocalizer(moment);

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

const EVENT_COLORS = {
  event: '#3b82f6',
  anniversary: '#ec4899'
};

export default function CalendarApp() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const fetchedEvents = await getEvents();
      setEvents(fetchedEvents.map((e) => ({
        ...e,
        start: new Date(e.start),
        end: e.end ? new Date(e.end) : undefined
      })));
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedSlot({ start, end });
    setSelectedEvent(null);
    setShowModal(true);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedSlot(null);
    setShowModal(true);
  };

  const handleDeleteEvent = async (id: string) => {
    const result = await deleteEvent(id);
    if (result.success) {
      setEvents(events.filter(e => e.id !== id));
      setShowModal(false);
    } else {
      console.error('Failed to delete event:', result.error);
    }
  };

  const handleSaveEvent = async (event: CalendarEvent) => {
    if (selectedEvent) {
      // Update existing event
      const result = await updateEvent({
        id: event.id,
        title: event.title,
        description: event.description,
        start: event.start,
        end: event.end,
        type: event.type,
        color: event.color
      });

      if (result.success && result.event) {
        setEvents(events.map(e => 
          e.id === event.id 
            ? { ...result.event, start: new Date(result.event.start), end: result.event.end ? new Date(result.event.end) : undefined }
            : e
        ));
      } else {
        console.error('Failed to update event:', result.error);
      }
    } else {
      // Create new event
      const result = await createEvent({
        title: event.title,
        description: event.description,
        start: event.start,
        end: event.end,
        type: event.type,
        color: event.color
      });

      if (result.success && result.event) {
        setEvents([...events, {
          ...result.event,
          start: new Date(result.event.start),
          end: result.event.end ? new Date(result.event.end) : undefined
        }]);
      } else {
        console.error('Failed to create event:', result.error);
      }
    }
    setShowModal(false);
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    return {
      style: {
        backgroundColor: event.color,
        borderRadius: '6px',
        opacity: 0.9,
        color: '#1e293b',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        fontSize: '13px',
        padding: '2px 6px',
        fontWeight: '500'
      }
    };
  };

  const CustomEvent = ({ event }: { event: CalendarEvent }) => {
    const getYearsSince = () => {
      if (event.type !== 'anniversary') return null;
      const years = moment().diff(moment(event.start), 'years');
      return years > 0 ? years : null;
    };

    const years = getYearsSince();

    return (
      <div className="flex items-center gap-1">
        {event.type === 'anniversary' ? (
          <Gift size={12} className="flex-shrink-0" />
        ) : (
          <Calendar size={12} className="flex-shrink-0" />
        )}
        <span className="truncate text-xs font-medium">
          {event.title}
          {years && <span className="ml-1 opacity-75">({years}y)</span>}
        </span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="text-slate-600">Loading calendar...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-light text-slate-900 mb-2">Calendar</h1>
                <p className="text-sm text-slate-500">{events.length} {events.length === 1 ? 'event' : 'events'}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedSlot({ start: new Date(), end: new Date() });
                  setSelectedEvent(null);
                  setShowModal(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition-all rounded-lg"
              >
                <Plus size={16} />
                <span>Add Event</span>
              </button>
            </div>

            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: EVENT_COLORS.event }}></div>
                <span className="text-xs text-slate-600">Events</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: EVENT_COLORS.anniversary }}></div>
                <span className="text-xs text-slate-600">Anniversaries</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 700 }}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              selectable
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
              eventPropGetter={eventStyleGetter}
              components={{
                event: CustomEvent
              }}
            />
          </div>
        </div>
      </div>

      {showModal && (
        <EventModal
          event={selectedEvent}
          slot={selectedSlot}
          onClose={() => setShowModal(false)}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
        />
      )}
    </div>
  );
}

function EventModal({ 
  event, 
  slot, 
  onClose, 
  onSave, 
  onDelete 
}: { 
  event: CalendarEvent | null;
  slot: { start: Date; end: Date } | null;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
}) {
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [type, setType] = useState<'event' | 'anniversary'>(event?.type || 'event');
  const [startDate, setStartDate] = useState(
    event?.start ? moment(event.start).format('YYYY-MM-DD') : 
    slot?.start ? moment(slot.start).format('YYYY-MM-DD') : 
    moment().format('YYYY-MM-DD')
  );
  const [startTime, setStartTime] = useState(
    event?.start ? moment(event.start).format('HH:mm') : '09:00'
  );
  const [endDate, setEndDate] = useState(
    event?.end ? moment(event.end).format('YYYY-MM-DD') : 
    slot?.end ? moment(slot.end).format('YYYY-MM-DD') : 
    moment().format('YYYY-MM-DD')
  );
  const [endTime, setEndTime] = useState(
    event?.end ? moment(event.end).format('HH:mm') : '10:00'
  );

  const handleSubmit = () => {
    if (!title.trim()) return;

    const start = moment(`${startDate} ${startTime}`).toDate();
    let end;
    
    if (type === 'anniversary') {
      end = moment(startDate).endOf('day').toDate();
    } else {
      end = moment(`${endDate} ${endTime}`).toDate();
    }

    const newEvent: CalendarEvent = {
      id: event?.id || `event-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      start,
      end,
      type,
      color: EVENT_COLORS[type],
      createdAt: event?.createdAt || new Date(),
      updatedAt: new Date()
    };

    onSave(newEvent);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-slate-900">
            {event ? 'Edit Event' : 'Create Event'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Type *
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setType('event')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  type === 'event'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <Calendar size={18} />
                <span className="font-medium">Event</span>
              </button>
              <button
                type="button"
                onClick={() => setType('anniversary')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  type === 'anniversary'
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <Gift size={18} />
                <span className="font-medium">Anniversary</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 transition-colors"
              />
            </div>
            {type === 'event' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Start Time *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 transition-colors"
                  />
                </div>
              </div>
            )}
          </div>

          {type === 'event' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  End Time *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about this event..."
              rows={4}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 transition-colors resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            {event ? (
              <button
                onClick={() => onDelete(event.id)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            ) : (
              <div></div>
            )}
            
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!title.trim()}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  !title.trim()
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                <span>{event ? 'Update' : 'Create'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}