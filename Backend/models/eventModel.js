// Backend/models/eventModel.js
import pool from '../config/database.js';

export const createEvent = async (eventData) => {
  const {
    title,           // Frontend sends "title" -> DB expects "event_title"
    date,
    start_time,      // Frontend sends "start_time" -> DB expects "time"
    duration,
    timezone,
    mode_of_event,   // Frontend sends "mode_of_event" -> DB expects "conference_details"
    organizer,       // Frontend sends "organizer" -> DB expects "name"
    meeting_link,    // We'll store this in conference_details for now
    location,        // Not in current DB schema, we'll ignore for now
    organizer_email, // Email field
  } = eventData;

  // Map frontend fields to database columns
  const insertQuery = `
    INSERT INTO events 
      (event_title, name, email, conference_details, duration, date, time, timezone) 
    VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8) 
    RETURNING *;
  `;

  const values = [
    title || 'Untitled Event',                    // event_title
    organizer || 'Unknown Organizer',             // name
    organizer_email || 'organizer@example.com',   // email
    `Mode: ${mode_of_event || 'Online'}${meeting_link ? ', Link: ' + meeting_link : ''}`, // conference_details
    duration || '60',                             // duration
    date || new Date().toISOString().split('T')[0], // date
    start_time || '09:00',                        // time
    timezone || 'UTC'                             // timezone
  ];

  console.log('💾 Inserting event with mapped values:', values);

  const result = await pool.query(insertQuery, values);
  const createdEvent = result.rows[0];
  
  // Map the created event to frontend expected format
  const mappedEvent = {
    id: createdEvent.id,
    title: createdEvent.event_title,
    organizer: createdEvent.name,
    organizer_email: createdEvent.email,
    date: createdEvent.date,
    start_time: createdEvent.time,
    duration: createdEvent.duration,
    timezone: createdEvent.timezone,
    mode_of_event: eventData.mode_of_event || 'Online',
    meeting_link: eventData.meeting_link || '',
    location: eventData.location || 'Virtual',
    conference_details: createdEvent.conference_details
  };
  
  console.log('✅ Created and mapped event:', mappedEvent);
  return mappedEvent;
};

export const getAllEvents = async () => {
  const selectQuery = `SELECT * FROM events ORDER BY date ASC, time ASC`;
  const result = await pool.query(selectQuery);
  
  // Map database fields to frontend expected fields
  const mappedEvents = result.rows.map(event => ({
    id: event.id,
    title: event.event_title,           // event_title -> title
    organizer: event.name,              // name -> organizer
    organizer_email: event.email,       // email -> organizer_email
    date: event.date,
    start_time: event.time,             // time -> start_time
    duration: event.duration,
    timezone: event.timezone,
    mode_of_event: 'Online',            // Default since not stored in DB
    meeting_link: '',                   // Extract from conference_details if needed
    location: 'Virtual',                // Default since not stored in DB
    conference_details: event.conference_details
  }));
  
  console.log('📋 Mapped events for frontend:', mappedEvents);
  return mappedEvents;
};
