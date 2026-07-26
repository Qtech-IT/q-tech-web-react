import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/Utils/helpers';
import { Button } from '@/Components/UI/Button';
import type { InputHTMLAttributes, ForwardedRef } from 'react';

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  disabled?: boolean;
  ref?: ForwardedRef<HTMLInputElement>;
}

export function PasswordInput({
  className,
  disabled,
  ref,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className={cn('relative rounded-md', className)}>
      <input
        type={showPassword ? 'text' : 'password'}
        className="flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-xs border-input placeholder:text-muted-foreground focus-visible:ring-ring h-9 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
        ref={ref}
        disabled={disabled}
        {...props}
      />
      <Button
        type="button"
        size="icon"
        variant="ghost"
        disabled={disabled}
        className="absolute w-6 h-6 -translate-y-1/2 rounded-md text-muted-foreground end-1 top-1/2"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
      </Button>
    </div>
  );
}
