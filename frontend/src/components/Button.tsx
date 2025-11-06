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
      'text-center font-inter',
      {
        'py-4 px-26 border bg-black text-white text-sm hover:bg-gray-800': primary,
        'py-6 px-8 bg-while text-black font-bold hover:bg-black hover:text-white': secondary,
        'rounded-[1vw]': rounded,
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
