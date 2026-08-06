import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            {toast.type === 'success' && <CheckCircle size={20} className="text-success" />}
            {toast.type === 'error' && <AlertCircle size={20} className="text-error" />}
            {toast.type === 'info' && <Info size={20} className="text-primary" />}
            {toast.type === 'warning' && <AlertTriangle size={20} className="text-warning" />}
            
            <div className="flex-1 text-sm font-medium">{toast.message}</div>
            
            <button 
              onClick={() => removeToast(toast.id)}
              className="btn-ghost btn-icon p-0"
              style={{ width: '20px', height: '20px' }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
