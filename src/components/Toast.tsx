"use client";

import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { CheckCircleIcon, InfoCircleIcon } from './ui/icons';


const Toast: React.FC<{ message: string; type: 'success' | 'info' | 'error'; onDismiss: () => void }> = ({ message, type, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    let dismissTimer: ReturnType<typeof setTimeout>;
    const timer = setTimeout(() => {
      setIsVisible(false);
      dismissTimer = setTimeout(onDismiss, 300);
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(dismissTimer);
    };
  }, [onDismiss]);
  
  const baseClasses = "fixed bottom-5 right-5 z-[100] flex items-center w-full max-w-xs p-4 space-x-4 rtl:space-x-reverse text-[var(--text)] bg-[var(--surface-1)] backdrop-blur-md divide-x rtl:divide-x-reverse divide-[var(--border)] rounded-lg shadow-lg transition-all duration-300";
  const visibilityClasses = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5';
  
  const typeStyles = {
    success: { icon: <CheckCircleIcon className="w-6 h-6 text-green-400" />, accentClass: 'border-green-500' },
    info: { icon: <InfoCircleIcon className="w-6 h-6 text-[var(--accent)]" />, accentClass: 'border-[var(--accent)]' },
    error: { icon: <InfoCircleIcon className="w-6 h-6 text-red-400" />, accentClass: 'border-red-500' },
  };

  const { icon, accentClass } = typeStyles[type];

  return (
    <div className={`${baseClasses} ${visibilityClasses} border-r-4 ${accentClass}`} role="alert">
      <div className="pl-3">{icon}</div>
      <div className="pr-4 text-sm font-normal">{message}</div>
    </div>
  );
};

const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToast();

    return (
        <>
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onDismiss={() => removeToast(toast.id)}
                />
            ))}
        </>
    );
};

export default ToastContainer;