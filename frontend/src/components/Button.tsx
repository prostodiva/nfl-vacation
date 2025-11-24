import classNames from 'classnames';
import { memo } from 'react';

interface ButtonProps {
  children: React.ReactNode;
  primary?: boolean;
  secondary?: boolean;
  ternary?: boolean;
  submit?:boolean;
  add?: boolean;
  rounded?: boolean;
  outline?: boolean;
  active?: boolean;
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
    ternary,
    submit,
    add,
    rounded,
    outline,
    active = false,
    type = 'button',
    disabled = false,
    className,
    ...rest
  }: ButtonProps) => {
    const buttonClasses = classNames(
      'text-center font-inter',
      {
        'py-4 px-26 border bg-black text-white text-sm hover:bg-gray-800': primary,
        //'py-6 px-8 bg-while text-black font-bold hover:bg-[#f76d1b] hover:text-white': secondary,
        'py-6 px-8 bg-while text-black hover:bg-[#f76d1b] hover:text-white': secondary && !active,
        'py-6 px-8 bg-[#f76d1b] text-white': secondary && active,
        'py-1 px-6 border bg-gray-900 text-white text-sm hover:bg-gray-500': ternary,
        'py-1 px-6 border text-black bg-white hover:bg-[#f76d1b] hover:text-white': submit,
        'py-1 px-6 border text-white bg-[#f76d1b] hover:bg-white hover:text-black': add,
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
