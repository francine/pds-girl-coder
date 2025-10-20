import { ObjectId } from 'mongodb';

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidObjectId(id: string): boolean {
  return ObjectId.isValid(id);
}

export function isValidEnum<T>(value: any, enumValues: T[]): value is T {
  return enumValues.includes(value);
}

export function validateStringLength(
  value: string,
  min?: number,
  max?: number
): { valid: boolean; error?: string } {
  if (min !== undefined && value.length < min) {
    return { valid: false, error: `Must be at least ${min} characters` };
  }
  if (max !== undefined && value.length > max) {
    return { valid: false, error: `Must be at most ${max} characters` };
  }
  return { valid: true };
}

export function validateDateRange(
  startDate: Date,
  endDate: Date
): { valid: boolean; error?: string } {
  if (startDate >= endDate) {
    return { valid: false, error: 'Start date must be before end date' };
  }
  return { valid: true };
}
