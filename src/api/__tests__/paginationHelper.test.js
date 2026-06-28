import { 
  validateLimit, 
  encodeCursor, 
  decodeCursor, 
  createPaginationResponse,
  buildPaginationQuery 
} from '../utils/paginationHelper';

describe('Pagination Helper', () => {
  describe('validateLimit', () => {
    test('should accept valid limit', () => {
      const result = validateLimit(20);
      expect(result.valid).toBe(true);
      expect(result.value).toBe(20);
    });

    test('should reject non-numeric limit', () => {
      const result = validateLimit('abc');
      expect(result.valid).toBe(false);
      expect(result.code).toBe('INVALID_LIMIT_FORMAT');
    });

    test('should reject limit less than min', () => {
      const result = validateLimit(0);
      expect(result.valid).toBe(false);
      expect(result.code).toBe('LIMIT_TOO_SMALL');
    });

    test('should reject limit greater than max', () => {
      const result = validateLimit(101);
      expect(result.valid).toBe(false);
      expect(result.code).toBe('LIMIT_TOO_LARGE');
    });
  });

  describe('Cursor encoding/decoding', () => {
    test('should encode and decode cursor', () => {
      const data = { offset: 20, id: 'order123' };
      const encoded = encodeCursor(data);
      const decoded = decodeCursor(encoded);
      
      expect(decoded).toEqual(data);
    });

    test('should handle null cursor', () => {
      const decoded = decodeCursor(null);
      expect(decoded).toBeNull();
    });

    test('should handle invalid cursor format', () => {
      const decoded = decodeCursor('invalid!!!');
      expect(decoded).toBeNull();
    });
  });

  describe('createPaginationResponse', () => {
    test('should create response with next cursor', () => {
      const items = [{ id: 1 }, { id: 2 }];
      const response = createPaginationResponse(items, null, 20, true);
      
      expect(response.data).toEqual(items);
      expect(response.pagination.hasMore).toBe(true);
      expect(response.pagination.nextCursor).toBeDefined();
    });

    test('should create response without next cursor', () => {
      const items = [{ id: 1 }];
      const response = createPaginationResponse(items, null, 20, false);
      
      expect(response.pagination.hasMore).toBe(false);
      expect(response.pagination.nextCursor).toBeUndefined();
    });
  });
});
