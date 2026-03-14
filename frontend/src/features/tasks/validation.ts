import type { TaskFormData } from './types';

export type FormErrors = Partial<Record<keyof TaskFormData, string>>;

export function validateTaskForm(data: TaskFormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.title.trim()) {
    errors.title = 'Title is required';
  } else if (data.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }

  if (!data.status) {
    errors.status = 'Status is required';
  }

  if (!data.priority) {
    errors.priority = 'Priority is required';
  }

  if (data.assignee.trim() && data.assignee.trim().length < 2) {
    errors.assignee = 'Assignee name must be at least 2 characters';
  }

  return errors;
}

export function hasErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0;
}
