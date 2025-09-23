// Backend/routes/eventRoutes.js
import express from 'express';
import { 
  getEvents, 
  createEvent, 
  getEventById, 
  updateEvent, 
  deleteEvent, 
  updateEventStatus, 
  getEventsByDateRange 
} from '../controllers/eventController.js';

const router = express.Router();

// GET /api/events - Get all events with optional filters
router.get('/', getEvents);

// POST /api/events - Create new event
router.post('/', createEvent);

// GET /api/events/date-range - Get events by date range
router.get('/date-range', getEventsByDateRange);

// GET /api/events/:id - Get specific event by ID
router.get('/:id', getEventById);

// PUT /api/events/:id - Update specific event
router.put('/:id', updateEvent);

// DELETE /api/events/:id - Delete specific event
router.delete('/:id', deleteEvent);

// PATCH /api/events/:id/status - Update event status only
router.patch('/:id/status', updateEventStatus);

export default router;
