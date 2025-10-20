import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

function Input({ className, ...rest }: InputProps) {
  return (
    <input
      className={`w-100 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${className || ''}`}
      {...rest}
    />
  );
}

export default Input;
