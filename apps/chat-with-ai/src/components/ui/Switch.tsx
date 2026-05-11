import * as React from 'react';
import { Check } from '@gluestack-ui/react';
import { cn } from '@/lib/cn';

interface SwitchProps extends React.ComponentProps<typeof Switch>> {
  label?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Switch({ 
  label, 
  checked = false, 
  onCheckedChange, 
  disabled = false, 
  className = '',
  ...props 
}: SwitchProps) {
  const id = React.useId();

  return (
    <Switch
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={cn(
        'flex flex-row items-center gap-2',
        disabled && 'opacity-50 cursor-not-allowed',
        checked && 'bg-primary',
        props.className
      )}
    >
      <div className={cn('w-4 h-4 rounded-md border', checked && 'border-primary', 'bg-secondary')}>
        <div className="w-4 h-4 rounded-full bg-white dark:bg-slate-800" />
        <label className={cn('text-sm font-medium text-slate-700 dark:text-slate-300', checked && 'text-primary dark:text-primary')}>
          {label}
        </label>
      </div>
    </Switch>
  );
}
