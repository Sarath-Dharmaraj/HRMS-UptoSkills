// Backend/models/eventModel.js
import pool from '../config/database.js';

export const createEvent = async (eventData) => {
  const {
    title,
    description = '',
    organizer,
    organizer_email = 'organizer@company.com',
    date,
    start_time,
    end_time,
    duration = 60,
    timezone = 'UTC',
    mode_of_event = 'online',
    meeting_link = '',
    location = '',
    max_attendees = null,
    tags = []
  } = eventData;

  const insertQuery = `
    INSERT INTO events (
      title, description, organizer, organizer_email, date, start_time, end_time,
      duration, timezone, mode_of_event, meeting_link, location, max_attendees, tags
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;
  `;

  const values = [
    title, description, organizer, organizer_email, date, start_time, end_time,
    duration, timezone, mode_of_event, meeting_link, location, max_attendees, tags
  ];

  console.log('💾 Creating event with values:', values);

  const result = await pool.query(insertQuery, values);
  const createdEvent = result.rows[0];
  
  console.log('✅ Event created successfully:', createdEvent);
  return createdEvent;
};

export const getAllEvents = async (filters = {}) => {
  let query = `
    SELECT id, title, description, organizer, organizer_email, date, start_time, end_time,
           duration, timezone, mode_of_event, meeting_link, location, status, max_attendees, tags,
           created_at, updated_at
    FROM events
  `;
  const conditions = [];
  const values = [];
  
  // Add filters
  if (filters.status) {
    conditions.push(`status = $${values.length + 1}`);
    values.push(filters.status);
  }
  
  if (filters.mode) {
    conditions.push(`mode_of_event = $${values.length + 1}`);
    values.push(filters.mode);
  }
  
  if (filters.organizer) {
    conditions.push(`organizer ILIKE $${values.length + 1}`);
    values.push(`%${filters.organizer}%`);
  }
  
  if (filters.date_from) {
    conditions.push(`date >= $${values.length + 1}`);
    values.push(filters.date_from);
  }
  
  if (filters.date_to) {
    conditions.push(`date <= $${values.length + 1}`);
    values.push(filters.date_to);
  }
  
  if (filters.search) {
    conditions.push(`(title ILIKE $${values.length + 1} OR description ILIKE $${values.length + 1})`);
    values.push(`%${filters.search}%`);
  }
  
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  
  query += ' ORDER BY date ASC, start_time ASC';
  
  console.log('📋 Fetching events with query:', query);
  console.log('📋 Query values:', values);
  
  const result = await pool.query(query, values);
  return result.rows;
};

export const getEventById = async (id) => {
  const query = `SELECT * FROM events WHERE id = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const updateEvent = async (id, eventData) => {
  const updates = [];
  const values = [];
  
  Object.keys(eventData).forEach((key, index) => {
    if (eventData[key] !== undefined) {
      updates.push(`${key} = $${index + 1}`);
      values.push(eventData[key]);
    }
  });
  
  if (updates.length === 0) {
    throw new Error('No data provided for update');
  }
  
  updates.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);
  
  const query = `
    UPDATE events 
    SET ${updates.join(', ')}
    WHERE id = $${values.length}
    RETURNING *
  `;
  
  console.log('🔄 Updating event with query:', query);
  console.log('🔄 Update values:', values);
  
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const deleteEvent = async (id) => {
  const query = `DELETE FROM events WHERE id = $1 RETURNING *`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const updateEventStatus = async (id, status) => {
  const query = `
    UPDATE events 
    SET status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
  `;
  const result = await pool.query(query, [status, id]);
  return result.rows[0];
};

export const getEventsByDateRange = async (startDate, endDate) => {
  const query = `
    SELECT * FROM events 
    WHERE date BETWEEN $1 AND $2 
    ORDER BY date ASC, start_time ASC
  `;
  const result = await pool.query(query, [startDate, endDate]);
  return result.rows;
};
