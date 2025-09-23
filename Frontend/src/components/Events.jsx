import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Calendar, Clock, User, MapPin, Video, AlertCircle, Plus, Search, Filter, Download, Globe, Users, Tag, CheckCircle2, PlayCircle, XCircle, Circle } from 'lucide-react';
import { eventsAPI, healthAPI } from '../services/api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [dbConnected, setDbConnected] = useState(false);
  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    mode: '',
    organizer: '',
    dateFrom: '',
    dateTo: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    start_time: '',
    end_time: '',
    duration: '',
    timezone: 'Asia/Kolkata',
    mode_of_event: 'online',
    organizer: '',
    organizer_email: '',
    meeting_link: '',
    location: '',
    max_attendees: '',
    tags: []
  });

  const TIMEZONES = [
    'Asia/Kolkata', 'America/New_York', 'Europe/London', 
    'Asia/Tokyo', 'Australia/Sydney', 'Europe/Berlin',
    'America/Los_Angeles', 'Asia/Dubai'
  ];

  const TAGS_OPTIONS = [
    'Workshop', 'Training', 'Meeting', 'Presentation', 
    'Team Building', 'AI', 'Technology', 'Leadership',
    'Data Science', 'Soft Skills', 'Analytics'
  ];

  // Check database connection on component mount
  useEffect(() => {
    const checkDbConnection = async () => {
      try {
        const response = await healthAPI.getDatabaseStatus();
        setDbConnected(response.data.success);
        if (response.data.success) {
          showMessage('✅ Database connected successfully', 'success');
        }
      } catch (error) {
        console.error('Database connection failed:', error);
        setDbConnected(false);
        showMessage('❌ Database connection failed', 'error');
      }
    };
    checkDbConnection();
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!form.title?.trim()) newErrors.title = 'Event title is required';
    if (!form.organizer?.trim()) newErrors.organizer = 'Organizer name is required';
    if (!form.date) newErrors.date = 'Event date is required';
    if (!form.start_time) newErrors.start_time = 'Start time is required';
    
    if (form.date && new Date(form.date) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.date = 'Event date cannot be in the past';
    }
    
    if (form.organizer_email && !/\S+@\S+\.\S+/.test(form.organizer_email)) {
      newErrors.organizer_email = 'Please enter a valid email address';
    }
    
    if (form.mode_of_event === 'online' && !form.meeting_link?.trim()) {
      newErrors.meeting_link = 'Meeting link is required for online events';
    }
    
    if (form.mode_of_event === 'offline' && !form.location?.trim()) {
      newErrors.location = 'Location is required for offline events';
    }

    if (form.max_attendees && (parseInt(form.max_attendees) < 1 || parseInt(form.max_attendees) > 1000)) {
      newErrors.max_attendees = 'Max attendees must be between 1 and 1000';
    }

    return newErrors;
  }, [form]);

  const showMessage = useCallback((msg, type = 'success') => {
    setPopup({ message: msg, type });
    setTimeout(() => setPopup(''), 4000);
  }, []);

  const resetForm = useCallback(() => {
    setForm({
      title: '', description: '', date: '', start_time: '', end_time: '', duration: '',
      timezone: 'Asia/Kolkata', mode_of_event: 'online', organizer: '', organizer_email: '',
      meeting_link: '', location: '', max_attendees: '', tags: []
    });
    setErrors({});
  }, []);

  const fetchEvents = useCallback(async (filterParams = {}) => {
    setLoading(true);
    try {
      console.log('🔄 Fetching events with filters:', filterParams);
      const response = await eventsAPI.getEvents(filterParams);
      
      if (response.data.success) {
        console.log('✅ Events fetched:', response.data.data);
        setEvents(response.data.data);
        setFilteredEvents(response.data.data);
        if (response.data.data.length === 0) {
          showMessage('No events found', 'info');
        }
      } else {
        console.error('Failed to fetch events:', response.data.message);
        showMessage('Failed to fetch events: ' + response.data.message, 'error');
        setEvents([]);
        setFilteredEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      showMessage('Failed to fetch events. Using fallback data.', 'error');
      // Fallback to empty array if API fails
      setEvents([]);
      setFilteredEvents([]);
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  // Search and filter functionality
  useEffect(() => {
    let filtered = [...events];

    // Apply search
    if (searchTerm.trim()) {
      filtered = filtered.filter(event =>
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.status) {
      filtered = filtered.filter(event => event.status === filters.status);
    }
    if (filters.mode) {
      filtered = filtered.filter(event => event.mode_of_event === filters.mode);
    }
    if (filters.organizer) {
      filtered = filtered.filter(event => 
        event.organizer?.toLowerCase().includes(filters.organizer.toLowerCase())
      );
    }
    if (filters.dateFrom) {
      filtered = filtered.filter(event => new Date(event.date) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      filtered = filtered.filter(event => new Date(event.date) <= new Date(filters.dateTo));
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (showModal && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [showModal]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleTagsChange = (tag) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitLoading(true);
    try {
      const eventData = {
        ...form,
        duration: form.duration ? parseInt(form.duration) : 60,
        max_attendees: form.max_attendees ? parseInt(form.max_attendees) : null,
      };

      console.log('📝 Submitting event:', eventData);
      const response = await eventsAPI.createEvent(eventData);
      
      if (response.data.success) {
        showMessage('✅ Event created successfully!', 'success');
        resetForm();
        setShowModal(false);
        fetchEvents(); // Refresh the events list
      } else {
        showMessage('Failed to create event: ' + response.data.message, 'error');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      showMessage('Failed to create event. Please try again.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCloseModal = useCallback(() => {
    if (form.title || form.organizer || form.date) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        resetForm();
        setShowModal(false);
      }
    } else {
      resetForm();
      setShowModal(false);
    }
  }, [form, resetForm]);

  const handleJoinEvent = useCallback((eventId, meetingLink) => {
    if (meetingLink && meetingLink !== '') {
      window.open(meetingLink, '_blank', 'noopener,noreferrer');
      showMessage('Opening meeting link...', 'success');
    } else {
      showMessage('Meeting link not available for this event', 'error');
    }
  }, [showMessage]);

  const handleExport = useCallback(() => {
    const csvContent = [
      ['Title', 'Organizer', 'Date', 'Time', 'Duration (min)', 'Mode', 'Status', 'Timezone'],
      ...filteredEvents.map(event => [
        event.title,
        event.organizer,
        event.date,
        event.start_time,
        event.duration,
        event.mode_of_event,
        event.status,
        event.timezone
      ])
    ].map(row => row.join(',')).join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `events-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showMessage('✅ Events exported successfully!', 'success');
    }
  }, [filteredEvents, showMessage]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'upcoming': return <Circle className="w-4 h-4 text-blue-500" />;
      case 'live': return <PlayCircle className="w-4 h-4 text-green-500" />;
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-gray-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'live': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'online': return <Video className="w-4 h-4" />;
      case 'offline': return <MapPin className="w-4 h-4" />;
      case 'hybrid': return <Globe className="w-4 h-4" />;
      default: return <Video className="w-4 h-4" />;
    }
  };

  const getModeColor = (mode) => {
    switch (mode) {
      case 'online': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'offline': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'hybrid': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-purple-100 text-purple-600 border-purple-200';
    }
  };

  const ErrorMessage = ({ error }) => error ? (
    <div className="text-red-400 text-sm mt-2 flex items-center gap-2" role="alert">
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      {error}
    </div>
  ) : null;

  const formatEventDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatEventTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header Section */}
      <div className="bg-white border-b border-purple-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${dbConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className="text-sm text-gray-600">
                    {dbConnected ? 'Database Connected' : 'Database Disconnected'} • {filteredEvents.length} events
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={handleExport}
                disabled={filteredEvents.length === 0}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Create Event
              </button>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="mt-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  showFilters ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">All Status</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="live">Live</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                    <select
                      value={filters.mode}
                      onChange={(e) => setFilters(prev => ({ ...prev, mode: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">All Modes</option>
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                    <input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                    <input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setFilters({ status: '', mode: '', organizer: '', dateFrom: '', dateTo: '' });
                        setSearchTerm('');
                      }}
                      className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md border border-gray-300 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || Object.values(filters).some(f => f) ? 
                'Try adjusting your search or filters.' : 
                'Create your first event to get started.'}
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              Create Your First Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 overflow-hidden group"
              >
                <div className="p-6">
                  {/* Event Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                          {getStatusIcon(event.status)}
                          {event.status?.toUpperCase() || 'UPCOMING'}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getModeColor(event.mode_of_event)}`}>
                          {getModeIcon(event.mode_of_event)}
                          {event.mode_of_event?.toUpperCase() || 'ONLINE'}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                        {event.title}
                      </h3>
                      {event.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4 text-purple-500" />
                      <span className="font-medium">{event.organizer || 'Unknown Organizer'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      <span>{formatEventDate(event.date)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-purple-500" />
                      <span>
                        {formatEventTime(event.start_time)} 
                        {event.duration && ` • ${event.duration} min`}
                        {event.timezone && (
                          <span className="text-xs text-gray-500 ml-1">
                            ({event.timezone})
                          </span>
                        )}
                      </span>
                    </div>

                    {event.location && event.mode_of_event !== 'online' && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-purple-500" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}

                    {event.max_attendees && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4 text-purple-500" />
                        <span>Max {event.max_attendees} attendees</span>
                      </div>
                    )}

                    {event.tags && event.tags.length > 0 && (
                      <div className="flex items-start gap-2 text-sm">
                        <Tag className="w-4 h-4 text-purple-500 mt-0.5" />
                        <div className="flex flex-wrap gap-1">
                          {event.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                          {event.tags.length > 3 && (
                            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                              +{event.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  {event.meeting_link && event.status === 'upcoming' && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleJoinEvent(event.id, event.meeting_link)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105"
                      >
                        <Video className="w-4 h-4" />
                        Join Meeting
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div 
            ref={modalRef}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] sm:h-[85vh] flex flex-col mx-2 sm:mx-0"
          >
            {/* Fixed Header */}
            <div className="flex-shrink-0 p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Plus className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Create New Event</h2>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={submitLoading}
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              {/* Scrollable Content Area */}
              <div 
                className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 modal-scrollbar" 
                style={{
                  maxHeight: 'calc(85vh - 200px)',
                  minHeight: '400px'
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Event Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    ref={firstInputRef}
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter event title"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    required
                  />
                  <ErrorMessage error={errors.title} />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Brief description of the event"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none"
                  />
                </div>

                {/* Organizer */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Organizer Name *
                  </label>
                  <input
                    type="text"
                    name="organizer"
                    value={form.organizer}
                    onChange={handleChange}
                    placeholder="Enter organizer name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    required
                  />
                  <ErrorMessage error={errors.organizer} />
                </div>

                {/* Organizer Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Organizer Email
                  </label>
                  <input
                    type="email"
                    name="organizer_email"
                    value={form.organizer_email}
                    onChange={handleChange}
                    placeholder="organizer@company.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  />
                  <ErrorMessage error={errors.organizer_email} />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    required
                  />
                  <ErrorMessage error={errors.date} />
                </div>

                {/* Start Time */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    name="start_time"
                    value={form.start_time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    required
                  />
                  <ErrorMessage error={errors.start_time} />
                </div>

                {/* End Time */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="end_time"
                    value={form.end_time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    placeholder="60"
                    min="1"
                    max="1440"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  />
                </div>

                {/* Timezone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    name="timezone"
                    value={form.timezone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  >
                    {TIMEZONES.map(tz => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>

                {/* Mode */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Mode
                  </label>
                  <select
                    name="mode_of_event"
                    value={form.mode_of_event}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  >
                    <option value="online">🖥️ Online</option>
                    <option value="offline">📍 Offline</option>
                    <option value="hybrid">🌐 Hybrid</option>
                  </select>
                </div>

                {/* Max Attendees */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Max Attendees
                  </label>
                  <input
                    type="number"
                    name="max_attendees"
                    value={form.max_attendees}
                    onChange={handleChange}
                    placeholder="50"
                    min="1"
                    max="1000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  />
                  <ErrorMessage error={errors.max_attendees} />
                </div>

                {/* Meeting Link */}
                {(form.mode_of_event === 'online' || form.mode_of_event === 'hybrid') && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Meeting Link {form.mode_of_event === 'online' && '*'}
                    </label>
                    <input
                      type="url"
                      name="meeting_link"
                      value={form.meeting_link}
                      onChange={handleChange}
                      placeholder="https://meet.company.com/event-room"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      required={form.mode_of_event === 'online'}
                    />
                    <ErrorMessage error={errors.meeting_link} />
                  </div>
                )}

                {/* Location */}
                {(form.mode_of_event === 'offline' || form.mode_of_event === 'hybrid') && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location {form.mode_of_event === 'offline' && '*'}
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="Conference Room A, Tech Hub, 123 Innovation Street"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      required={form.mode_of_event === 'offline'}
                    />
                    <ErrorMessage error={errors.location} />
                  </div>
                )}

                {/* Tags */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TAGS_OPTIONS.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagsChange(tag)}
                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                          form.tags.includes(tag)
                            ? 'bg-purple-100 text-purple-800 border-purple-300'
                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              </div>

              {/* Fixed Footer with Form Actions */}
              <div className="flex-shrink-0 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={submitLoading}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Create Event
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success/Error Messages */}
      {popup && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`px-6 py-4 rounded-lg shadow-lg ${
            popup.type === 'success' ? 'bg-green-500 text-white' :
            popup.type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
          }`}>
            {popup.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;