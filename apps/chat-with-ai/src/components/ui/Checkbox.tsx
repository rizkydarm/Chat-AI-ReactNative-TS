import * as React from 'react';
import { Check } from '@gluestack-ui/react';
import { cn } from '@/lib/cn';

interface CheckboxProps extends React.ComponentProps<typeof Check>> {
  label?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({ 
  label, 
  checked = false, 
  onCheckedChange, 
  disabled = false, 
  className = '',
  ...props 
}: CheckboxProps) {
  const id = React.useId();

  return (
    <Check
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={cn(
        'flex flex-row items-center gap-2',
        disabled && 'opacity-50 cursor-not-allowed',
        className && 'hover:bg-accent/10 transition-colors',
        props.className
      )}
    >
      <div className={cn('w-4 h-4 rounded border border', checked && 'border-primary', 'bg-secondary')}>
        <div className="w-4 h-4 rounded-md border-2 border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
        <label className={cn('text-sm font-medium text-slate-700 dark:text-slate-300', checked && 'text-primary dark:text-primary')}>
          {label}
        </label>
      </div>
    </Check>
  );
}
