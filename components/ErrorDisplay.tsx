
import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="w-full max-w-md p-6 bg-red-500/20 rounded-2xl shadow-lg border border-red-500/50 backdrop-blur-sm text-center text-red-200">
      <h3 className="text-xl font-bold mb-2">Oops! Something went wrong.</h3>
      <p>{message}</p>
    </div>
  );
};
