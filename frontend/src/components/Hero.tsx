import { useState } from 'react';
import Button from './Button';
import TeamsList from './TeamsList';
import SearchInput from './SearchInput';

function Hero() {
  const [showTeams, setShowTeams] = useState(false);

  const handleClick = () => {
    setShowTeams(!showTeams); //Toggle visibility
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="flex flex-col items-center space-y-6">
          <SearchInput />

          <Button primary rounded onClick={handleClick}>
            Find Teams
          </Button>

          {showTeams && <TeamsList />}
        </div>
      </div>
    </div>
  );
}

export default Hero;
