import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchInput() {
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
          className="w-[1079px] h-[79px] mt-10 mb-[25px] pt-[30px] pr-[815px] pb-[30px] pl-[25px] opacity-70 rounded-[20px] border border-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Search teams..."
        />
      </div>
    </form>
  );
}
