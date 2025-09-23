// Frontend/src/services/api.js
import axios from "axios"

const API_BASE_URL = "http://localhost:5000"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
})

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API endpoints
export const dashboardAPI = {
  getDashboardData: (timeframe = "month", department = "all") =>
    api.get(`/api/dashboard/data?timeframe=${timeframe}&department=${department}`),

  getEmployees: () => api.get("/api/dashboard/employees"),

  getDepartments: () => api.get("/api/dashboard/departments"),

  getAttendance: () => api.get("/api/dashboard/attendance"),

  getPerformance: () => api.get("/api/dashboard/performance"),
}

export const eventsAPI = {
  // Get all events with optional filters
  getEvents: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.append(key, value);
      }
    });
    const queryString = params.toString();
    return api.get(`/api/events${queryString ? `?${queryString}` : ''}`);
  },

  // Create new event
  createEvent: (eventData) => api.post("/api/events", eventData),

  // Get specific event by ID
  getEventById: (id) => api.get(`/api/events/${id}`),

  // Update specific event
  updateEvent: (id, eventData) => api.put(`/api/events/${id}`, eventData),

  // Delete specific event
  deleteEvent: (id) => api.delete(`/api/events/${id}`),

  // Update event status only
  updateEventStatus: (id, status) => api.patch(`/api/events/${id}/status`, { status }),

  // Get events by date range
  getEventsByDateRange: (startDate, endDate) => 
    api.get(`/api/events/date-range?start_date=${startDate}&end_date=${endDate}`),
}

export const healthAPI = {
  // Check server health
  getHealthStatus: () => api.get("/api/health"),

  // Check database connection
  getDatabaseStatus: () => api.get("/api/health/database"),
}

export default api
