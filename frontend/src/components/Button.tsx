import classNames from 'classnames';
import { memo } from 'react';

interface ButtonProps {
  children: React.ReactNode;
  primary?: boolean;
  primaryTwo?: boolean;
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
    primaryTwo,
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
        'py-3 px-24 rounded-md bg-white text-black text-sm hover:bg-[#e93448] hover:text-white': primary,
        'py-3 px-24 rounded-md bg-white text-black text-sm hover:bg-[#3b3c5e] hover:text-gray-400': primaryTwo,
        'py-6 px-8 bg-gray-100 text-[#3b3c5e] font-bold hover:bg-[#e93448] hover:text-white': secondary && !active,
        'py-6 px-8 bg-[#3b3c5e] text-white': secondary && active,
        'py-1 px-6 border bg-[#e93448] text-white text-sm hover:bg-[#3b3c5e]': ternary,
        'py-1 px-6 border text-black bg-white hover:bg-[#e93448] hover:text-white': submit,
        'py-1 px-6 border text-white bg-[#e93448] hover:bg-white hover:text-black': add,
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
