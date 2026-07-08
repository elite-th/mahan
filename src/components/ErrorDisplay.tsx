import React from 'react';

interface ErrorDisplayProps {
  message?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message = 'خطا در برقراری ارتباط با سرور. لطفا بعدا تلاش کنید.' }) => (
  <div className="text-center p-8 bg-red-900/30 border border-red-500/50 rounded-lg my-4" role="alert">
     <p className="text-red-400 font-semibold text-xl">متاسفانه خطایی رخ داد</p>
     <p className="text-red-300 mt-2">{message}</p>
  </div>
);

export default ErrorDisplay;