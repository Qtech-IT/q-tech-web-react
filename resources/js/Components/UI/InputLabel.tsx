import React from 'react';
import type  { PropsWithChildren, LabelHTMLAttributes } from 'react'; 
interface InputLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  value?: string;
  className?: string;
}

export default function InputLabel({
  value,
  className = '',
  children,
  ...props
}: PropsWithChildren<InputLabelProps>) {
  return (
    <label
      {...props}
      className={`block text-sm font-medium text-gray-700 ${className}`}
    >
      {value ? value : children}
    </label>
  );
}
