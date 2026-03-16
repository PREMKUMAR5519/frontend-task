import './Badge.scss';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'priority-low' | 'priority-medium' | 'priority-high';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={className ? `ui-badge ui-badge--${variant} ${className}` : `ui-badge ui-badge--${variant}`}>
      {children}
    </span>
  );
}
