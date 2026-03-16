import { type HTMLAttributes } from 'react';
import './Card.scss';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div className={className ? `ui-card ${className}` : 'ui-card'} {...props}>
      {children}
    </div>
  );
}
