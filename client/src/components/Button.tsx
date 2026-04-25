import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'danger';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  isLoading, 
  className, 
  ...props 
}) => {
  const classes = [
    'btn',
    variant === 'primary' ? 'btn-primary' : variant === 'danger' ? 'btn-danger' : 'btn-outline',
    fullWidth ? 'btn-full' : '',
    className || ''
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? 'Loading...' : children}
    </button>
  );
};
