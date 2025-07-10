/**
 * Form validation state
 * Represents the validation state of the form
 */
export interface FormValidationState {
  /** Whether the form is valid */
  isValid: boolean;
  /** Validation errors */
  errors: Record<string, string>;
  /** Whether the form has been touched */
  touched: boolean;
} 