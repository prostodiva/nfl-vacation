import { useEffect, useState, useRef } from "react";
import { GoChevronDown } from 'react-icons/go';

export interface DropdownOption {
    value: string | number;
    label: string;
}

interface DropdownProps {
    options: DropdownOption[];
    value: DropdownOption | null;
    onChange: (option: DropdownOption) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    panelClassName?: string;
    optionClassName?: string;
}

function Dropdown({
                      options,
                      value,
                      onChange,
                      placeholder = 'Select...',
                      className = '',
                      disabled = false,
                      panelClassName = '',
                      optionClassName = ''
                  }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const divEl = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (event: MouseEvent) => {
            if (!divEl.current) {
                return;
            }

            if (!divEl.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handler, true);

        return () => {
            document.removeEventListener('click', handler);
        };
    }, []);

    const handleClick = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    const handleOptionClick = (option: DropdownOption) => {
        setIsOpen(false);
        onChange(option);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleClick();
        } else if (event.key === 'Escape') {
            setIsOpen(false);
        }
    };

    const handleOptionKeyDown = (event: React.KeyboardEvent, option: DropdownOption) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleOptionClick(option);
        }
    };

    const renderedOptions = options.map((option) => {
        return (
            <div
                className={`hover:font-bold hover:text-white rounded cursor-pointer p-1 ${optionClassName}`}
                onClick={() => handleOptionClick(option)}
                onKeyDown={(e) => handleOptionKeyDown(e, option)}
                key={option.value}
                role="option"
                aria-selected={value?.value === option.value}
                tabIndex={0}
            >
                {option.label}
            </div>
        );
    });

    return (
        <div
            ref={divEl}
            className={`relative w-50 ${className}`}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-disabled={disabled}
        >
            <div
                className={`flex justify-between items-center cursor-pointer border border-gray-300 rounded px-3 py-2 bg-white text-gray-400 hover:bg-[#3b3c5e] hover:border-gray-400 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${panelClassName}`}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                tabIndex={disabled ? -1 : 0}
                role="button"
                aria-label="Select option"
            >
                <span className={value ? 'text-gray-900' : 'text-gray-400'}>
                    {value?.label || placeholder}
                </span>
                <GoChevronDown
                    className={`text-lg text-white transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </div>
            {isOpen && (
                <div
                    className="absolute top-full mt-1 w-full text-gray-400 border border-gray-300 rounded bg-[#3b3c5e] shadow-lg z-10 max-h-60 overflow-y-auto"
                    role="listbox"
                >
                    {renderedOptions}
                </div>
            )}
        </div>
    );
}

export default Dropdown;