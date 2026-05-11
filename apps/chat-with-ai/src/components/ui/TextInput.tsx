import * as React from 'react';
import { TextInput } from 'react-native';
import { cn } from '@/lib/cn';

interface TextInputProps extends React.ComponentProps<typeof TextInput>> {
  label?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  className?: string;
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad' | 'decimal-pad' | 'url' | 'web-search';
}

export function TextInput({ 
  label, 
  value = '', 
  onChangeText, 
  placeholder = '', 
  secureTextEntry = false, 
  className = '', 
  multiline = false, 
  numberOfLines = 1, 
  editable = true, 
  keyboardType = 'default', 
  ...props 
}: TextInputProps) {
  const id = React.useId();

  return (
    <TextInput
      id={id}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      className={cn(
        'w-full px-4 py-2 border border border-gray-300 rounded-md',
        'focus:border-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
        'text-base sm text-gray-900 placeholder:text-gray-400 dark:placeholder-text-gray-500 dark:text-white',
        'text-sm font-medium text-gray-700 dark:text-gray-300',
        props.className
      )}
    />
  );
}
