import { createPortal } from 'react-dom';
import { useToast } from './ToastContext';
import './Toast.scss';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="ui-toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`ui-toast ui-toast--${toast.type}`}>
          <span>{toast.message}</span>
          <button
            className="ui-toast__dismiss"
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss notification"
          >
            x
          </button>
        </div>
      ))}
    </div>,
    document.body,
  );
}
