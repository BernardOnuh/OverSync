import { PaginationValidator } from '../utils/paginationValidators';

describe('PaginationValidator', () => {
  let validator;

  beforeEach(() => {
    validator = new PaginationValidator();
  });

  test('should validate correct limit', () => {
    const result = validator.validateLimitParameter(20);
    expect(result.valid).toBe(true);
    expect(result.value).toBe(20);
  });

  test('should use default limit when not provided', () => {
    const result = validator.validateLimitParameter(undefined);
    expect(result.valid).toBe(true);
    expect(result.value).toBe(20);
  });

  test('should reject non-numeric limit', () => {
    const result = validator.validateLimitParameter('abc');
    expect(result.valid).toBe(false);
    expect(result.code).toBe('INVALID_LIMIT_FORMAT');
  });

  test('should validate cursor parameter', () => {
    const result = validator.validateCursorParameter('dGVzdA==');
    expect(result.valid).toBe(true);
  });

  test('should reject invalid cursor format', () => {
    const result = validator.validateCursorParameter('!!!invalid!!!');
    expect(result.valid).toBe(false);
  });

  test('should validate full pagination request', () => {
    const result = validator.validatePaginationRequest(20, 'dGVzdA==');
    expect(result.valid).toBe(true);
    expect(result.limit).toBe(20);
  });

  test('should reject invalid pagination request', () => {
    const result = validator.validatePaginationRequest(999, null);
    expect(result.valid).toBe(false);
  });
});
