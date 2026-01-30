import { TimeoutError, ValidationError } from '../src/errors';

describe('TimeoutError', () => {
  it('should be an instance of Error', () => {
    const error = new TimeoutError(1000);
    expect(error).toBeInstanceOf(Error);
  });

  it('should be an instance of TimeoutError', () => {
    const error = new TimeoutError(1000);
    expect(error).toBeInstanceOf(TimeoutError);
  });

  it('should have the correct name', () => {
    const error = new TimeoutError(1000);
    expect(error.name).toBe('TimeoutError');
  });

  it('should have the correct default message', () => {
    const error = new TimeoutError(1000);
    expect(error.message).toBe('Condition not met within 1000ms timeout');
  });

  it('should use custom message when provided', () => {
    const customMessage = 'Custom timeout message';
    const error = new TimeoutError(1000, customMessage);
    expect(error.message).toBe(customMessage);
  });

  it('should store the timeout value', () => {
    const timeout = 5000;
    const error = new TimeoutError(timeout);
    expect(error.timeout).toBe(timeout);
  });

  it('should have a stack trace', () => {
    const error = new TimeoutError(1000);
    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe('string');
  });

  it('should be catchable as Error', () => {
    const throwError = (): void => {
      throw new TimeoutError(1000);
    };

    expect(throwError).toThrow(Error);
  });

  it('should be catchable as TimeoutError', () => {
    const throwError = (): void => {
      throw new TimeoutError(1000);
    };

    expect(throwError).toThrow(TimeoutError);
  });
});

describe('ValidationError', () => {
  it('should be an instance of Error', () => {
    const error = new ValidationError('Invalid input');
    expect(error).toBeInstanceOf(Error);
  });

  it('should be an instance of ValidationError', () => {
    const error = new ValidationError('Invalid input');
    expect(error).toBeInstanceOf(ValidationError);
  });

  it('should have the correct name', () => {
    const error = new ValidationError('Invalid input');
    expect(error.name).toBe('ValidationError');
  });

  it('should have the correct message', () => {
    const message = 'Invalid input provided';
    const error = new ValidationError(message);
    expect(error.message).toBe(message);
  });

  it('should have a stack trace', () => {
    const error = new ValidationError('Invalid input');
    expect(error.stack).toBeDefined();
  });
});
