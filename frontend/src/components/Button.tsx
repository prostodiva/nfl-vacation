import classNames from 'classnames';
import { memo } from 'react';

interface ButtonProps {
  children: React.ReactNode;
  primary?: boolean;
  secondary?: boolean;
  rounded?: boolean;
  outline?: boolean;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

const Button = memo(
  ({
    children,
    primary,
    secondary,
    rounded,
    outline,
    type = 'button',
    disabled = false,
    className,
    ...rest
  }: ButtonProps) => {
    const buttonClasses = classNames(
      'text-center py-3 px-4 border',
      {
        'bg-gray-500 text-white hover:bg-gray-800': primary,
        'bg-purple-700 text-white hover:bg-purple-800': secondary,
        'rounded-full': rounded,
        'bg-white': outline,
        'opacity-50 cursor-not-allowed': disabled,
      },
      className
    );

    return (
      <button
        type={type}
        disabled={disabled}
        className={buttonClasses}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

export default Button;
