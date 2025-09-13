// Backend/controllers/eventController.js
import * as eventModel from '../models/eventModel.js';

export const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      date,
      start_time,
      duration,
      timezone,
      mode_of_event,
      organizer,
      meeting_link,
      location,
      organizer_email  // Optional email field
    } = req.body;

    console.log('📝 Received event data:', req.body);

    if (!title || !date) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and date are required.' 
      });
    }

    // Prepare data with email mapping
    const eventData = {
      title,
      date,
      start_time,
      duration,
      timezone,
      mode_of_event,
      organizer,
      meeting_link,
      location,
      organizer_email: organizer_email || 'organizer@example.com'  // Default email if not provided
    };

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
    console.log('📋 Fetching all events...');
    const events = await eventModel.getAllEvents();
    console.log(`✅ Found ${events.length} events`);

    res.status(200).json({
      success: true,
      message: "Events fetched successfully",
      data: events
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
