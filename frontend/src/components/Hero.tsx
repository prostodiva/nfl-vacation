import { useNavigate } from "react-router-dom";
import Button from './Button';
import SearchInput from './SearchInput';
import player from '../assets/player.png'
import ball from '../assets/ball.png'

function Hero() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/search');
  };

  return (
    <div className="bg-gray-100 flex flex-col">
      
      <div className="w-full mx-auto px-4 py-8 flex justify-center items-center bg-[#3b3c5e] h-180">
        <div className="flex flex-col items-center space-y-6">
            <img
                src={player}
                alt="NFL Player"
                className="absolute inset-0 h-full z-0 pointer-events-none"
                style={{
                    objectPosition: 'center',
                    maxHeight: '100%',
                    transform: 'scale(2)',
                    transformOrigin: 'left top',
                }}
            />
            <img
                src={ball}
                alt="NFL Ball"
                className="absolute inset-0 h-full z-0 pointer-events-none opacity-10"
                style={{
                    objectPosition: 'center',
                    maxHeight: '50%',
                    transform: 'translateX(140%)',
                    transformOrigin: 'left bottom',
                }}
            />
            <div className="relative z-10 flex flex-col items-start space-y-2 w-[1079px] ml-30">
              <h1 className="text-[160px] leading-tight text-white" style={{ fontFamily: 'SCHABO, sans-serif'}}>
                Explore the Home of Champions <span className="text-[110px] -rotate-8 inline-block relative top-[-30px]"> NFL / JOURNEY</span>
              </h1>
              <p className="text-xl leading-relaxed text-white">
                From historic arenas to modern domes - discover <br></br> legends
                play and fans unite.
              </p>
              <SearchInput className="w-[950px] mt-4" />
            </div>

            <Button primary rounded onClick={handleClick} className="mt-1">
              Find Teams
            </Button>
          </div>  
        </div>

        <div className="mx-auto px-4 py-8 flex justify-center items-center flex flex-col items-start w-[1079px]">
          <p className="text-left mt-10 font-bold text-[#3b3c5e]">
            Your personal NFL travel guide.
          </p>
          <p className="text-[#3b3c5e]">Find details, schedules, and insider tips for every stadium.</p>
          <div className="w-full h-px bg-[#3b3c5e]"></div>
        </div>
      </div>
  );
}

export default Hero;
