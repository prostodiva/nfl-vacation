import { useNavigate } from "react-router-dom";
import plate from '../assets/plate.png';
import player from '../assets/player.png';
import Button from './Button';
import SearchInput from './SearchInput';

function Hero() {
  const navigate = useNavigate();


  const handleClick = () => {
    navigate('/search');
  };

  return (
    <div className="bg-gray-100 flex flex-col relative" data-testid="hero">
      <div className="w-full mx-auto px-4 py-8 flex justify-center items-center bg-[#3b3c5e] h-[80vh] relative z-0">
      <img
          src={player}
          alt="NFL Player"
          className="absolute left-0 top-0 z-[1] pointer-events-none"
          style={{
              objectPosition: 'left top',
              height: '100%',
              transform: 'scale(2.5)', 
              transformOrigin: 'left top',
          }}
      />

        <div className="relative z-10 flex flex-col items-center space-y-4 w-[70vw] ml-[5vw] mt-[5vh]">
          <h1 className="text-[10vw] leading-none text-white self-start tracking-normal" 
              style={{ fontFamily: 'SCHABO, sans-serif' }}>
            Explore the Home of Champions 
            <span className="text-[5vw] -rotate-5 inline-block relative ml-[7.5vw] drop-shadow-lg z-10"
            style={{
                top: '-2vw',
                WebkitTextStroke: '0.05vw black',
                textShadow: '0.2vw 0.2vw 0.4vw rgba(0, 0, 0, 0.5)'
            }}> 
              <img
                src={plate}
                alt="plate"
                className="absolute rotate-5 z-0 pointer-events-none left-[40%] -translate-x-1/2 top-1/2 -translate-y-1/2"
                style={{
                  width: '15vw',
                  transform: 'scale(1.7)',
                }}
              />
              <span className="relative z-10">NFL / JOURNEY</span>
            </span>
          </h1>
          <p className="text-[1.5vw] leading-none text-white mt-10 self-start">
            From historic arenas to modern domes - discover <br /> legends
            play and fans unite.
          </p>
          <SearchInput className="w-[70vw] mt-4 self-start" /> 

          <Button primary rounded onClick={handleClick} className="mt-10 relative z-10">
            Find Teams
          </Button>
        </div>
      </div>

      {/* Second section - outside the blue background */}
      <div className="mx-auto px-4 py-8 flex justify-center items-center relative">
        <div className="flex flex-col items-start w-full max-w-[1079px] relative z-10">
          <p className="text-left mt-[3vh] font-bold text-[#3b3c5e] text-[1.2vw]">
            Your personal NFL travel guide.
          </p>
          <p className="text-[#3b3c5e] text-[1vw]">Find details, schedules, and insider tips for every stadium.</p>
          <div className="w-full h-px bg-[#3b3c5e] mt-4"></div>
        </div>
      </div>
    </div>
  );
}
export default Hero;
