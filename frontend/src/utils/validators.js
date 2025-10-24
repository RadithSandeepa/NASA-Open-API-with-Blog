// Simple input validation and sanitization helpers
export function validateEmail(email) {
  // Basic email regex
  return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
}

export function validatePassword(password) {
  // At least 8 characters, one letter, one number
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
}

export function sanitizeInput(input) {
  // Remove script tags and encode special characters
  return input.replace(/<script.*?>.*?<\/script>/gi, '')
    .replace(/[&<>"]/g, function (c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];
    });
}

export function validatePhone(phone) {
  // Basic phone number validation (10-15 digits)
  return /^\d{10,15}$/.test(phone);
}
