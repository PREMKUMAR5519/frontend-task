import { type InputHTMLAttributes } from 'react';
import './TextInput.scss';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function TextInput({ label, error, id, className, ...props }: TextInputProps) {
  const inputId = id ?? label.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className={className ? `ui-text-input-field ${className}` : 'ui-text-input-field'}>
      <label htmlFor={inputId} className="ui-text-input-label">
        {label}
      </label>
      <input
        id={inputId}
        className={
          error ? 'ui-text-input-control ui-text-input-control--invalid' : 'ui-text-input-control'
        }
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <span id={`${inputId}-error`} className="ui-text-input-error">
          {error}
        </span>
      )}
    </div>
  );
}
