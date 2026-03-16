import { useState, useRef, useEffect, useId, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './Select.scss';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export function Select({
  label,
  options,
  value,
  onChange,
  error,
  placeholder,
  disabled,
  id,
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, minWidth: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const autoId = useId();
  const fieldId = id || autoId;

  const selectedOption = options.find((opt) => opt.value === value);
  const triggerText = selectedOption?.label ?? placeholder ?? 'Select...';

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 5,
      left: rect.left,
      minWidth: rect.width,
    });
  }, []);

  useEffect(() => {
    if (!open) return;

    updatePosition();

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        wrapperRef.current && !wrapperRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    const handleScroll = () => updatePosition();

    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleScroll);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
    };
  }, [open, updatePosition]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false);
  };

  const pick = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  const triggerClass = [
    'select-trigger',
    open && 'select-trigger--open',
    error && 'select-trigger--error',
  ]
    .filter(Boolean)
    .join(' ');

  const dropdown = open
    ? createPortal(
        <ul
          ref={dropdownRef}
          className="select-dropdown"
          role="listbox"
          aria-label={label || undefined}
          style={{
            top: dropdownPos.top,
            left: dropdownPos.left,
            minWidth: dropdownPos.minWidth,
          }}
        >
          {placeholder !== undefined && (
            <li
              key="__all"
              role="option"
              aria-selected={value === ''}
              className={value === '' ? 'select-option select-option--active' : 'select-option'}
              onClick={() => pick('')}
            >
              <span>{placeholder}</span>
              {value === '' && (
                <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true">
                  <path
                    d="M1 5L4.5 8.5L12 1"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </li>
          )}

          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={value === opt.value}
              className={
                value === opt.value ? 'select-option select-option--active' : 'select-option'
              }
              onClick={() => pick(opt.value)}
            >
              <span>{opt.label}</span>
              {value === opt.value && (
                <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true">
                  <path
                    d="M1 5L4.5 8.5L12 1"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </li>
          ))}
        </ul>,
        document.body,
      )
    : null;

  return (
    <div
      ref={wrapperRef}
      className={className ? `select-field ${className}` : 'select-field'}
      onKeyDown={handleKeyDown}
    >
      {label && (
        <label htmlFor={fieldId} className="select-label">
          {label}
        </label>
      )}

      <button
        type="button"
        ref={triggerRef}
        id={fieldId}
        className={triggerClass}
        onClick={() => setOpen((prev) => !prev)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{triggerText}</span>
        <svg
          className="select-trigger__chevron"
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1 1L5 5L9 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {dropdown}

      {error && (
        <span className="select-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
