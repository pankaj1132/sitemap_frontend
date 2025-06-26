import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

function Toast({ message, type = 'info', duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);
  const { colors, isDarkMode } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastClasses = () => {
    const baseClasses = `fixed top-4 right-4 max-w-sm w-full ${colors.bg.card} shadow-lg rounded-lg pointer-events-auto transform transition-all duration-300 z-50 border ${colors.border.primary}`;
    const visibilityClasses = isVisible ? "translate-x-0 opacity-100 scale-100" : "translate-x-full opacity-0 scale-95";
    
    let colorClasses = "";
    switch (type) {
      case 'success':
        colorClasses = "border-l-4 border-green-500";
        break;
      case 'error':
        colorClasses = "border-l-4 border-red-500";
        break;
      case 'warning':
        colorClasses = "border-l-4 border-yellow-500";
        break;
      default:
        colorClasses = "border-l-4 border-blue-500";
    }
    
    return `${baseClasses} ${visibilityClasses} ${colorClasses}`;
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
    }
  };

  return (
    <div className={getToastClasses()}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className={`text-sm font-medium ${colors.text.primary}`}>
              {message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className={`${colors.bg.card} rounded-md inline-flex ${colors.text.secondary} hover:${colors.text.primary} focus:outline-none transition-colors duration-200 transform hover:scale-110`}
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 1000);
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Toast;
