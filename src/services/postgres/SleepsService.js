const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError'); // Assuming this exists

class SleepsService {
  constructor() {
    this._pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });
  }

  async addSleep({ bedtime, wakeuptime }) {
    const created_at = new Date().toISOString();
    const updated_at = new Date().toISOString();
    const query = {
      text: 'INSERT INTO sleeps (bedtime, wakeuptime, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING id',
      values: [bedtime, wakeuptime, created_at, updated_at],
    };
    console.log(query);
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Failed to add sleep data');
    }

    return result.rows[0].id;
  }

  async getAllSleeps() {
    const query = {
      text: 'SELECT * FROM sleeps ORDER BY created_at DESC LIMIT 7',
      values: [],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('No sleep data found');
    }

    return result.rows;
  }

  async getLatestSleep() {
    const query = {
      text: 'SELECT * FROM sleeps ORDER BY created_at DESC LIMIT 1',
      values: [],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('No sleep data found');
    }

    return result.rows[0];
  }

  // Method to calculate sleep duration and quality
  calculateDuration(bedtime, wakeuptime) {
    console.log('Calculating duration...');
    console.log('Bedtime:', bedtime);
    console.log('Wakeuptime:', wakeuptime);
  
    const bedtimeDate = this.parseTimeToISO(bedtime);
    let wakeuptimeDate = this.parseTimeToISO(wakeuptime);
  
    if (isNaN(bedtimeDate) || isNaN(wakeuptimeDate)) {
      throw new Error('Invalid date format');
    }
  
    // Adjust wakeuptime to the next day if it's earlier or equal to bedtime
    if (wakeuptimeDate <= bedtimeDate) {
      wakeuptimeDate.setDate(wakeuptimeDate.getDate() + 1);
    }
  
    const durationMs = wakeuptimeDate - bedtimeDate;
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
    const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  
    // Calculate sleep quality based on duration
    let quality;
    if (durationHours >= 8) {
      quality = 100;
    } else if (durationHours >= 7) {
      quality = 75;
    } else if (durationHours >= 6) {
      quality = 50;
    } else if (durationHours >= 5) {
      quality = 25;
    } else {
      quality = 10;
    }
  
    return {
      hours: durationHours,
      minutes: durationMinutes,
      quality,
    };
  }
  

  // Method to parse time to ISO format
  parseTimeToISO(time) {
    const date = new Date();
    const [timePart, meridian] = time.split(' ');
    let [hours, minutes, seconds] = timePart.split(':').map(Number);
    seconds = seconds || 0; // Handle cases where seconds are not provided
  
    if (meridian) {
      if (meridian.toUpperCase() === 'PM' && hours < 12) {
        hours += 12;
      } else if (meridian.toUpperCase() === 'AM' && hours === 12) {
        hours = 0;
      }
    }
  
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
    date.setMilliseconds(0);
  
    return date;
  }
  
}

module.exports = SleepsService;
