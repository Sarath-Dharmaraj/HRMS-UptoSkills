import pool from './config/database.js';

async function createEventsTable() {
  try {
    console.log('🗂️  Creating events table...');
    
    // Create events table with comprehensive schema
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        organizer VARCHAR(100) NOT NULL,
        organizer_email VARCHAR(100) DEFAULT 'organizer@company.com',
        date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME,
        duration INTEGER DEFAULT 60,
        timezone VARCHAR(50) DEFAULT 'UTC',
        mode_of_event VARCHAR(20) DEFAULT 'online' CHECK (mode_of_event IN ('online', 'offline', 'hybrid')),
        meeting_link TEXT,
        location TEXT,
        status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed', 'cancelled')),
        max_attendees INTEGER,
        tags TEXT[],
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_by VARCHAR(100) DEFAULT 'system'
      );
    `;
    
    await pool.query(createTableQuery);
    console.log('✅ Events table created successfully!');
    
    // Create index for better performance
    const indexQueries = [
      'CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);',
      'CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);',
      'CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer);'
    ];
    
    for (const query of indexQueries) {
      await pool.query(query);
    }
    console.log('✅ Database indexes created!');
    
    // Insert sample data for demonstration
    const sampleEvents = [
      {
        title: 'AI & Machine Learning Workshop',
        description: 'Deep dive into AI fundamentals and practical applications in business',
        organizer: 'Kaushik Mandal',
        organizer_email: 'kaushik@company.com',
        date: '2025-01-15',
        start_time: '10:00',
        end_time: '12:00',
        duration: 120,
        timezone: 'Asia/Kolkata',
        mode_of_event: 'hybrid',
        meeting_link: 'https://meet.company.com/ai-workshop',
        location: 'Conference Room A, Tech Hub',
        status: 'upcoming',
        max_attendees: 50,
        tags: ['AI', 'Workshop', 'Technology']
      },
      {
        title: 'Team Building & Leadership Skills',
        description: 'Interactive session on team dynamics and leadership development',
        organizer: 'Viky Deka',
        organizer_email: 'viky@company.com',
        date: '2025-01-22',
        start_time: '14:30',
        end_time: '17:00',
        duration: 150,
        timezone: 'Asia/Kolkata',
        mode_of_event: 'offline',
        location: 'Main Auditorium, Corporate Office',
        status: 'upcoming',
        max_attendees: 100,
        tags: ['Leadership', 'Team Building', 'Soft Skills']
      },
      {
        title: 'Data Science & Analytics Bootcamp',
        description: 'Comprehensive training on data analysis, visualization, and predictive modeling',
        organizer: 'Decendman Pothmi',
        organizer_email: 'decendman@company.com',
        date: '2025-02-05',
        start_time: '09:00',
        end_time: '17:00',
        duration: 480,
        timezone: 'Asia/Kolkata',
        mode_of_event: 'hybrid',
        meeting_link: 'https://meet.company.com/data-bootcamp',
        location: 'Training Center, Floor 3',
        status: 'upcoming',
        max_attendees: 30,
        tags: ['Data Science', 'Analytics', 'Training']
      }
    ];
    
    console.log('📝 Inserting sample events...');
    
    for (const event of sampleEvents) {
      const insertQuery = `
        INSERT INTO events (
          title, description, organizer, organizer_email, date, start_time, end_time, 
          duration, timezone, mode_of_event, meeting_link, location, status, max_attendees, tags
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      `;
      
      await pool.query(insertQuery, [
        event.title, event.description, event.organizer, event.organizer_email,
        event.date, event.start_time, event.end_time, event.duration, event.timezone,
        event.mode_of_event, event.meeting_link, event.location, event.status,
        event.max_attendees, event.tags
      ]);
    }
    
    console.log('✅ Sample events inserted successfully!');
    
    // Verify the data
    const result = await pool.query('SELECT COUNT(*) FROM events');
    console.log(`📊 Total events in database: ${result.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error creating events table:', error.message);
  } finally {
    await pool.end();
    console.log('🔌 Database connection closed.');
  }
}

createEventsTable();