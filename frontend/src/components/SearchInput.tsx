import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchInputProps {
  className?: string;
}

export default function SearchInput({ className = '' }: SearchInputProps) {
  const [term, setTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (term.trim()) {
      navigate(`/search?term=${term}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className={`h-[50px] px-6 py-[30px] opacity-70 rounded-md border border-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent ${className}`}
          placeholder="Search teams..."
        />
      </div>
    </form>
  );
}
