import { type TextareaHTMLAttributes } from 'react';
import './TextArea.scss';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function TextArea({ label, error, id, className, ...props }: TextAreaProps) {
  const textareaId = id || label.toLowerCase().replace(/\s+/g, '-');
  const controlClass = error
    ? 'ui-text-area-control ui-text-area-control--invalid'
    : 'ui-text-area-control';

  return (
    <div className={className ? `ui-text-area-field ${className}` : 'ui-text-area-field'}>
      <label htmlFor={textareaId} className="ui-text-area-label">
        {label}
      </label>
      <textarea
        id={textareaId}
        className={controlClass}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${textareaId}-error` : undefined}
        rows={3}
        {...props}
      />
      {error && (
        <span id={`${textareaId}-error`} className="ui-text-area-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
