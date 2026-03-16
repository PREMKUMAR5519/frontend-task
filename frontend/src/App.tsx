import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BoardPage } from './features/tasks/components/TaskBoard/BoardPage';
import { ToastProvider } from './components/ui/Toast/ToastContext';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="app">
          <Routes>
            <Route path="/" element={<BoardPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}
