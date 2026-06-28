/**
 * Pagination Helper Utilities
 * Handles cursor-based pagination for order history
 */
 
const CURSOR_ENCODING = 'base64url';
const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 20;
const MIN_LIMIT = 1;
 
export const validateLimit = (limit) => {
  const parsed = parseInt(limit, 10);
  
  if (isNaN(parsed)) {
    return {
      valid: false,
      error: 'Limit must be a number',
      code: 'INVALID_LIMIT_FORMAT'
    };
  }
  
  if (parsed < MIN_LIMIT) {
    return {
      valid: false,
      error: `Limit must be at least ${MIN_LIMIT}`,
      code: 'LIMIT_TOO_SMALL'
    };
  }
  
  if (parsed > MAX_LIMIT) {
    return {
      valid: false,
      error: `Limit cannot exceed ${MAX_LIMIT}`,
      code: 'LIMIT_TOO_LARGE'
    };
  }
  
  return { valid: true, value: parsed };
};
 
export const encodeCursor = (data) => {
  try {
    const json = JSON.stringify(data);
    return Buffer.from(json).toString('base64url');
  } catch (err) {
    throw new Error('Failed to encode cursor');
  }
};
 
export const decodeCursor = (cursor) => {
  try {
    if (!cursor) return null;
    const json = Buffer.from(cursor, 'base64url').toString('utf-8');
    return JSON.parse(json);
  } catch (err) {
    return null;
  }
};
 
export const createPaginationResponse = (items, cursor, limit, hasMore) => {
  return {
    data: items,
    pagination: {
      limit,
      cursor,
      hasMore,
      ...(hasMore && { nextCursor: encodeCursor({ offset: cursor?.offset + limit || limit }) })
    }
  };
};
 
export const buildPaginationQuery = (cursor, limit) => {
  const decodedCursor = decodeCursor(cursor);
  const offset = decodedCursor?.offset || 0;
  
  return {
    offset,
    limit,
    cursor: decodedCursor
  };
};
