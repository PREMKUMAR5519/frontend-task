import { type ButtonHTMLAttributes } from 'react';
import './Button.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={
        className
          ? `ui-button ui-button--${variant} ui-button--${size} ${className}`
          : `ui-button ui-button--${variant} ui-button--${size}`
      }
      {...props}
    >
      {children}
    </button>
  );
}
