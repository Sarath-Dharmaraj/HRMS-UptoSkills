import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Calendar, Clock, Users, Video, MapPin, Plus, X, AlertCircle, CheckCircle } from 'lucide-react';

// Default events to show when API fails or no data is available
const defaultEvents = [
  {
    id: "default-1",
    title: "AI Masterclass",
    organizer: "Kaushik Mandal",
    duration: 45,
    date: "2026-02-28T11:59:00.000Z",
    mode_of_event: "online",
    timezone: "Asia/Kolkata",
    meeting_link: "https://meet.example.com/ai-masterclass"
  },
  {
    id: "default-2",
    title: "Web3 & Blockchain",
    organizer: "Viky Deka",
    duration: 300,
    date: "2025-08-15T00:00:00.000Z",
    mode_of_event: "online",
    timezone: "Europe/London",
    meeting_link: "https://meet.example.com/web-dev"
  },
  {
    id: "default-3",
    title: "Data Science Workshop",
    organizer: "Decendman Pothmi",
    duration: 120,
    date: "2025-09-10T14:30:00.000Z",
    mode_of_event: "hybrid",
    timezone: "America/New_York",
    meeting_link: "https://meet.example.com/data-science",
    location: "Tech Hub, 123 Innovation Street, New York"
  },
  {
    id: "default-4",
    title: "Mobile App Development",
    organizer: "Lungsom Lamino",
    duration: 180,
    date: "2025-10-05T09:00:00.000Z",
    mode_of_event: "offline",
    timezone: "Asia/Tokyo",
    location: "Development Center, 456 Code Avenue, Tokyo"
  },
  {
    id: "default-5",
    title: "Cloud Computing Fundamentals",
    organizer: "Pranab Mahananda",
    duration: 90,
    date: "2025-11-20T16:45:00.000Z",
    mode_of_event: "online",
    timezone: "Europe/Berlin",
    meeting_link: "https://meet.example.com/cloud-computing"
  },
  {
    id: "default-6",
    title: "UI/UX Design Bootcamp",
    organizer: "Karishma Patel",
    duration: 240,
    date: "2025-12-08T10:15:00.000Z",
    mode_of_event: "hybrid",
    timezone: "Asia/Dubai",
    meeting_link: "https://meet.example.com/ui-ux-design",
    location: "Design Studio, 789 Creative Plaza, Dubai"
  }
];

const Events = () => {
  const [events, setEvents] = useState(defaultEvents);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState('');
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  const [form, setForm] = useState({
    name: '', date: '', startTime: '', duration: '', timezone: 'Asia/Kolkata',
    mode: 'Online', organizer: '', meetingLink: ''
  });

  const TIMEZONES = ['Asia/Kolkata', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney'];

  const validateForm = useCallback(() => {
    const newErrors = {};
    const now = new Date();
    const eventDateTime = new Date(`${form.date}T${form.startTime}`);

    if (!form.name.trim() || form.name.trim().length < 3) newErrors.name = 'Event title must be at least 3 characters';
    if (!form.date) newErrors.date = 'Date is required';
    else if (eventDateTime < now) newErrors.date = 'Cannot schedule events in the past';
    if (!form.startTime) newErrors.startTime = 'Start time is required';
    if (!form.duration || parseInt(form.duration) < 15 || parseInt(form.duration) > 480) {
      newErrors.duration = 'Duration must be 15-480 minutes';
    }
    if (!form.organizer.trim()) newErrors.organizer = 'Organizer name is required';
    if (!form.meetingLink.trim() || !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(form.meetingLink)) {
      newErrors.meetingLink = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const showMessage = useCallback((msg, type = 'success') => {
    setPopup({ message: msg, type });
    setTimeout(() => setPopup(''), 3000);
  }, []);

  const resetForm = useCallback(() => {
    setForm({ name: '', date: '', startTime: '', duration: '', timezone: 'Asia/Kolkata', mode: 'Online', organizer: '', meetingLink: '' });
    setErrors({});
  }, []);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events');
      if (!res.ok) throw new Error('Failed to fetch events');
      const data = await res.json();
      setEvents(data);
      showMessage('Events loaded successfully!');
    } catch (err) {
      console.error('Error fetching events:', err);
      setEvents(defaultEvents);
      showMessage('Using default events', 'error');
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  useEffect(() => {
    if (showModal) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
      const handleEscape = (e) => e.key === 'Escape' && handleCloseModal();
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [showModal]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  }, [errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return showMessage('Please fix the errors below', 'error');
    setSubmitLoading(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const newEvent = await res.json();
      setEvents(prev => [newEvent, ...prev]);
      setShowModal(false);
      resetForm();
      showMessage('Event created successfully!');
    } catch (err) {
      console.error('Error creating event:', err);
      showMessage('Failed to create event. Please try again.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCloseModal = useCallback(() => {
    const hasChanges = Object.values(form).some(value => value !== '' && value !== 'Asia/Kolkata' && value !== 'Online');
    if (hasChanges && !window.confirm('You have unsaved changes. Are you sure you want to close?')) return;
    setShowModal(false);
    resetForm();
  }, [form, resetForm]);

  const handleJoinEvent = useCallback((eventId, meetingLink) => {
    if (meetingLink) {
      window.open(meetingLink, '_blank', 'noopener,noreferrer');
      showMessage('Opening meeting link...');
    } else {
      showMessage('No meeting link available', 'error');
    }
  }, [showMessage]);

  const initialsAvatar = (name = '') => {
    const initials = name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
    return (
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-sm shadow-lg">
        {initials || 'NA'}
      </div>
    );
  };

  const ErrorMessage = ({ error }) => error ? (
    <div className="text-red-400 text-sm mt-2 flex items-center gap-2" role="alert">
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      {error}
    </div>
  ) : null;

  const getModeIcon = (mode) => {
    const icons = { Online: <Video className="w-4 h-4" />, Offline: <MapPin className="w-4 h-4" />, Hybrid: <Users className="w-4 h-4" /> };
    return icons[mode] || icons.Online;
  };

  const getModeColor = (mode) => {
    const colors = {
      Online: 'bg-blue-50 text-blue-700 border-blue-200',
      Offline: 'bg-green-50 text-green-700 border-green-200',
      Hybrid: 'bg-purple-50 text-purple-700 border-purple-200'
    };
    return colors[mode] || colors.Online;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">
      {popup && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-lg shadow-2xl border backdrop-blur-sm transition-all duration-300 ${popup.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
          }`}>
          <div className="flex items-center gap-3">
            {popup.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{popup.message}</span>
          </div>
        </div>
      )}

      <div className="px-6 md:px-12 lg:px-20 xl:px-40 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent mb-8 px-4 py-2">
              Upcoming Events
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
              Stay connected and never miss important meetings. Join your scheduled events with ease.
            </p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-violet-300 to-purple-300 hover:from-violet-400 hover:to-purple-400 text-black font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <Plus className="w-5 h-5" />Create Event
          </button>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="flex items-center gap-3 text-gray-600">
                <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="font-medium">Loading events...</span>
              </div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No events scheduled</h3>
              <p className="text-gray-400">Create your first event to get started!</p>
            </div>
          ) : (
            events.map((event, index) => (
              <div key={event.id || index} className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-gray-300">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    {initialsAvatar(event.organizer)}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{event.title || event.name}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-violet-500" />
                          <span className="font-medium">{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-violet-500" />
                          <span className="font-medium">{event.startTime || new Date(event.date).toLocaleTimeString()} ({event.duration} min)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-violet-500" />
                          <span className="font-medium">{event.organizer}</span>
                        </div>
                      </div>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getModeColor(event.mode || event.mode_of_event)}`}>
                        {getModeIcon(event.mode || event.mode_of_event)}
                        {event.mode || event.mode_of_event}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-32">
                    <button onClick={() => handleJoinEvent(event.id, event.meetingLink || event.meeting_link)} className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      Join
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 px-4" role="dialog" aria-modal="true">
          <div ref={modalRef} className="bg-white border border-gray-200 rounded-2xl shadow-2xl w-full max-w-2xl mx-auto text-gray-900 max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Create New Event</h2>
                <button type="button" onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <X className="w-6 h-6 text-gray-600 hover:text-gray-900" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">Event Title *</label>
                    <input ref={firstInputRef} type="text" name="name" value={form.name} onChange={handleChange} placeholder="Enter event title" required className={`w-full border rounded-xl px-4 py-3 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 ${errors.name ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-300 hover:border-gray-400'}`} />
                    <ErrorMessage error={errors.name} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-3">Date *</label>
                      <input type="date" name="date" value={form.date} onChange={handleChange} required className={`w-full border rounded-xl px-4 py-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 ${errors.date ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-300 hover:border-gray-400'}`} />
                      <ErrorMessage error={errors.date} />
                    </div>
                    <div>
                      <label htmlFor="startTime" className="block text-sm font-semibold text-gray-700 mb-3">Start Time *</label>
                      <input type="time" name="startTime" value={form.startTime} onChange={handleChange} required className={`w-full border rounded-xl px-4 py-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 ${errors.startTime ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-300 hover:border-gray-400'}`} />
                      <ErrorMessage error={errors.startTime} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="duration" className="block text-sm font-semibold text-gray-700 mb-3">Duration (minutes) *</label>
                      <input type="number" name="duration" value={form.duration} onChange={handleChange} placeholder="60" min="15" max="480" required className={`w-full border rounded-xl px-4 py-3 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 ${errors.duration ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-300 hover:border-gray-400'}`} />
                      <ErrorMessage error={errors.duration} />
                    </div>
                    <div>
                      <label htmlFor="organizer" className="block text-sm font-semibold text-gray-700 mb-3">Organizer *</label>
                      <input type="text" name="organizer" value={form.organizer} onChange={handleChange} placeholder="Your name" required className={`w-full border rounded-xl px-4 py-3 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 ${errors.organizer ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-300 hover:border-gray-400'}`} />
                      <ErrorMessage error={errors.organizer} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="timezone" className="block text-sm font-semibold text-gray-700 mb-3">Timezone *</label>
                    <select name="timezone" value={form.timezone} onChange={handleChange} required className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 hover:border-gray-400">
                      {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="mode" className="block text-sm font-semibold text-gray-700 mb-3">Event Mode *</label>
                    <select name="mode" value={form.mode} onChange={handleChange} required className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 hover:border-gray-400">
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="meetingLink" className="block text-sm font-semibold text-gray-700 mb-3">Meeting Link *</label>
                    <input type="url" name="meetingLink" value={form.meetingLink} onChange={handleChange} placeholder="https://meet.google.com/..." required className={`w-full border rounded-xl px-4 py-3 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 ${errors.meetingLink ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-300 hover:border-gray-400'}`} />
                    <ErrorMessage error={errors.meetingLink} />
                  </div>
                </div>

                <div className="flex gap-4 justify-end p-8 pt-6 border-t border-gray-200">
                  <button type="button" onClick={handleCloseModal} className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-xl font-semibold transition-colors duration-200">Cancel</button>
                  <button type="submit" disabled={submitLoading} className="px-8 py-3 bg-gradient-to-r from-violet-300 to-purple-300 hover:from-violet-400 hover:to-purple-400 text-black font-bold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg">
                    {submitLoading ? (
                      <span className="flex items-center gap-3">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </span>
                    ) : 'Create Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
