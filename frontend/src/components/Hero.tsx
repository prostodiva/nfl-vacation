import { useState } from "react";
import Button from "./Button";
import TeamsList from "./TeamsList";
import SearchInput from "./SearchInput";

function Hero() {
const [showTeams, setShowTeams] = useState(false);  

const handleClick = () => {
    setShowTeams(!showTeams);       //Toggle visibility
}

    return (
        <div>
            <SearchInput />
            <Button 
                primary
                rounded
                onClick={handleClick}
            >
               Show Teams
            </Button>
        
            {showTeams && <TeamsList />}
        </div>
        
    );
}

export default Hero;