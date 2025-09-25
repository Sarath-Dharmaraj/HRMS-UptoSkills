// Backend/controllers/eventController.js
import * as eventModel from '../models/eventModel.js';

export const createEvent = async (req, res, next) => {
  try {
    const eventData = {
      title: req.body.title || req.body.name,
      description: req.body.description,
      organizer: req.body.organizer,
      organizer_email: req.body.organizer_email,
      date: req.body.date,
      start_time: req.body.start_time || req.body.startTime,
      end_time: req.body.end_time || req.body.endTime,
      duration: parseInt(req.body.duration) || 60,
      timezone: req.body.timezone,
      mode_of_event: req.body.mode_of_event || req.body.mode,
      meeting_link: req.body.meeting_link || req.body.meetingLink,
      location: req.body.location,
      max_attendees: req.body.max_attendees ? parseInt(req.body.max_attendees) : null,
      tags: req.body.tags || []
    };

    console.log('📝 Received event data:', eventData);

    // Validation
    if (!eventData.title || !eventData.date || !eventData.organizer) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, date, and organizer are required.' 
      });
    }

    const newEvent = await eventModel.createEvent(eventData);

    console.log('✅ Event created successfully:', newEvent);
    
    res.status(201).json({ 
      success: true, 
      message: 'Event created successfully', 
      data: newEvent 
    });
  } catch (err) {
    console.error('❌ Error creating event:', err);
    next(err);
  }
};

export const getEvents = async (req, res, next) => {
  try {
    console.log('📋 Fetching events with query params:', req.query);
    
    const filters = {
      status: req.query.status,
      mode: req.query.mode,
      organizer: req.query.organizer,
      date_from: req.query.date_from,
      date_to: req.query.date_to,
      search: req.query.search
    };

    const events = await eventModel.getAllEvents(filters);
    console.log(`✅ Found ${events.length} events`);

    res.status(200).json({
      success: true,
      message: "Events fetched successfully",
      data: events,
      count: events.length
    });
  } catch (error) {
    console.error('❌ Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching events",
      error: error.message
    });
  }
};

export const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Fetching event with ID: ${id}`);

    const event = await eventModel.getEventById(id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    console.log('✅ Event found:', event);

    res.status(200).json({
      success: true,
      message: "Event fetched successfully",
      data: event
    });
  } catch (error) {
    console.error('❌ Error fetching event:', error);
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Map frontend field names if needed
    if (updateData.name) updateData.title = updateData.name;
    if (updateData.startTime) updateData.start_time = updateData.startTime;
    if (updateData.endTime) updateData.end_time = updateData.endTime;
    if (updateData.mode) updateData.mode_of_event = updateData.mode;
    if (updateData.meetingLink) updateData.meeting_link = updateData.meetingLink;

    console.log(`🔄 Updating event ${id} with data:`, updateData);

    const updatedEvent = await eventModel.updateEvent(id, updateData);
    
    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    console.log('✅ Event updated successfully:', updatedEvent);

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent
    });
  } catch (error) {
    console.error('❌ Error updating event:', error);
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`�️  Deleting event with ID: ${id}`);

    const deletedEvent = await eventModel.deleteEvent(id);
    
    if (!deletedEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    console.log('✅ Event deleted successfully:', deletedEvent);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
      data: deletedEvent
    });
  } catch (error) {
    console.error('❌ Error deleting event:', error);
    next(error);
  }
};

export const updateEventStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['upcoming', 'live', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Valid status is required (upcoming, live, completed, cancelled)"
      });
    }

    console.log(`📊 Updating event ${id} status to: ${status}`);

    const updatedEvent = await eventModel.updateEventStatus(id, status);
    
    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    console.log('✅ Event status updated successfully:', updatedEvent);

    res.status(200).json({
      success: true,
      message: "Event status updated successfully",
      data: updatedEvent
    });
  } catch (error) {
    console.error('❌ Error updating event status:', error);
    next(error);
  }
};

export const getEventsByDateRange = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date are required"
      });
    }

    console.log(`📅 Fetching events from ${start_date} to ${end_date}`);

    const events = await eventModel.getEventsByDateRange(start_date, end_date);

    res.status(200).json({
      success: true,
      message: "Events fetched successfully",
      data: events,
      count: events.length
    });
  } catch (error) {
    console.error('❌ Error fetching events by date range:', error);
    next(error);
  }
};
