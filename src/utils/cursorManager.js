/**
 * Cursor Manager
 * Manages cursor creation, validation, and serialization for stable pagination
 */
 
export class CursorManager {
  constructor(options = {}) {
    this.options = {
      encoding: 'base64url',
      ttl: null, // Cursor TTL in milliseconds
      ...options
    };
  }
 
  /**
   * Create a cursor from order data
   */
  createCursor(orderId, timestamp, index) {
    const cursorData = {
      id: orderId,
      ts: timestamp,
      idx: index,
      created: Date.now()
    };
 
    return this.encode(cursorData);
  }
 
  /**
   * Parse cursor to extract position data
   */
  parseCursor(cursor) {
    try {
      const data = this.decode(cursor);
      
      if (!data || typeof data !== 'object') {
        return null;
      }
 
      if (this.options.ttl && Date.now() - data.created > this.options.ttl) {
        return null; // Cursor expired
      }
 
      return data;
    } catch (err) {
      return null;
    }
  }
 
  /**
   * Encode cursor data
   */
  encode(data) {
    try {
      const json = JSON.stringify(data);
      return Buffer.from(json).toString(this.options.encoding);
    } catch (err) {
      throw new Error('Cursor encoding failed');
    }
  }
 
  /**
   * Decode cursor data
   */
  decode(cursor) {
    try {
      if (!cursor) return null;
      const json = Buffer.from(cursor, this.options.encoding).toString('utf-8');
      return JSON.parse(json);
    } catch (err) {
      throw new Error('Invalid cursor format');
    }
  }
 
  /**
   * Validate cursor integrity
   */
  validate(cursor) {
    const parsed = this.parseCursor(cursor);
    return parsed !== null;
  }
}
