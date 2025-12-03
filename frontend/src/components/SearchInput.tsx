import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchInputProps {
  className?: string;
  onSearchChange?: (term: string) => void;
  disableNavigation?: boolean;
  placeholder?: string;
}

export default function SearchInput({ 
  className = '', 
  onSearchChange,
  disableNavigation = false,
  placeholder = "Search teams..."
}: SearchInputProps) {
  const [term, setTerm] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTerm(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (term.trim() && !disableNavigation) {
      navigate(`/search?term=${term}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <input
          value={term}
          onChange={handleChange}
          className={`h-[50px] px-6 py-[30px] opacity-70 rounded-md border border-white text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent ${className}`}
          placeholder={placeholder}
        />
      </div>
    </form>
  );
}
