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
          className={`h-[79px] px-6 py-[30px] opacity-70 rounded-[20px] border border-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
          placeholder="Search teams..."
        />
      </div>
    </form>
  );
}
