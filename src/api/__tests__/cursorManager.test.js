import { CursorManager } from '../utils/cursorManager';

describe('CursorManager', () => {
  let manager;

  beforeEach(() => {
    manager = new CursorManager();
  });

  test('should create valid cursor', () => {
    const cursor = manager.createCursor('order123', Date.now(), 0);
    expect(typeof cursor).toBe('string');
    expect(cursor.length > 0).toBe(true);
  });

  test('should parse valid cursor', () => {
    const cursor = manager.createCursor('order123', Date.now(), 5);
    const parsed = manager.parseCursor(cursor);
    
    expect(parsed).not.toBeNull();
    expect(parsed.id).toBe('order123');
    expect(parsed.idx).toBe(5);
  });

  test('should reject invalid cursor', () => {
    const parsed = manager.parseCursor('invalid-cursor-data');
    expect(parsed).toBeNull();
  });

  test('should validate cursor', () => {
    const cursor = manager.createCursor('order123', Date.now(), 0);
    expect(manager.validate(cursor)).toBe(true);
  });

  test('should invalidate malformed cursor', () => {
    expect(manager.validate('definitely-not-a-cursor')).toBe(false);
  });

  test('should handle null cursor', () => {
    const parsed = manager.parseCursor(null);
    expect(parsed).toBeNull();
  });
});
