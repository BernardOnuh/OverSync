/**
 * Pagination Validators
 * Comprehensive validation for pagination parameters
 */
 
export const PAGINATION_ERRORS = {
  INVALID_LIMIT_FORMAT: 'Limit must be a valid integer',
  LIMIT_TOO_SMALL: 'Limit must be greater than 0',
  LIMIT_TOO_LARGE: 'Limit cannot exceed maximum allowed value',
  INVALID_CURSOR_FORMAT: 'Cursor format is invalid',
  EXPIRED_CURSOR: 'Cursor has expired',
  MALFORMED_CURSOR: 'Cursor is malformed or corrupted'
};
 
export class PaginationValidator {
  constructor(config = {}) {
    this.config = {
      minLimit: config.minLimit || 1,
      maxLimit: config.maxLimit || 100,
      defaultLimit: config.defaultLimit || 20,
      maxCursorAge: config.maxCursorAge || 86400000 // 24 hours
    };
  }
 
  validateLimitParameter(limit) {
    if (limit === undefined || limit === null) {
      return {
        valid: true,
        value: this.config.defaultLimit
      };
    }
 
    const parsed = parseInt(limit, 10);
 
    if (isNaN(parsed)) {
      return {
        valid: false,
        error: PAGINATION_ERRORS.INVALID_LIMIT_FORMAT,
        code: 'INVALID_LIMIT_FORMAT'
      };
    }
 
    if (parsed < this.config.minLimit) {
      return {
        valid: false,
        error: PAGINATION_ERRORS.LIMIT_TOO_SMALL,
        code: 'LIMIT_TOO_SMALL'
      };
    }
 
    if (parsed > this.config.maxLimit) {
      return {
        valid: false,
        error: PAGINATION_ERRORS.LIMIT_TOO_LARGE,
        code: 'LIMIT_TOO_LARGE'
      };
    }
 
    return { valid: true, value: parsed };
  }
 
  validateCursorParameter(cursor) {
    if (!cursor) {
      return { valid: true, value: null };
    }
 
    // Check format
    if (typeof cursor !== 'string' || cursor.length === 0) {
      return {
        valid: false,
        error: PAGINATION_ERRORS.INVALID_CURSOR_FORMAT,
        code: 'INVALID_CURSOR_FORMAT'
      };
    }
 
    // Check base64 format
    if (!/^[A-Za-z0-9_-]+$/.test(cursor)) {
      return {
        valid: false,
        error: PAGINATION_ERRORS.MALFORMED_CURSOR,
        code: 'MALFORMED_CURSOR'
      };
    }
 
    return { valid: true, value: cursor };
  }
 
  validatePaginationRequest(limit, cursor) {
    const limitValidation = this.validateLimitParameter(limit);
    if (!limitValidation.valid) {
      return limitValidation;
    }
 
    const cursorValidation = this.validateCursorParameter(cursor);
    if (!cursorValidation.valid) {
      return cursorValidation;
    }
 
    return {
      valid: true,
      limit: limitValidation.value,
      cursor: cursorValidation.value
    };
  }
}
