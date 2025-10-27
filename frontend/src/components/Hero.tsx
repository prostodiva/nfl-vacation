import { useNavigate } from "react-router-dom";
import Button from './Button';
import SearchInput from './SearchInput';

function Hero() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/search');
  };

  return (
    <div className="bg-gray-100">
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="flex flex-col items-center space-y-6">
            <div className="flex flex-col items-start space-y-2 w-[1079px]">
              <h1 className="text-[180px] leading-tight text-black" style={{ fontFamily: 'SCHABO, sans-serif'}}>
                Explore the Home of Champions <span className="text-[120px] -rotate-8 inline-block relative top-[-30px]"> NFL / JOURNEY</span>
              </h1>
              <p className="text-2xl leading-relaxed text-[#000]">
                From historic arenas to modern domes - discover <br></br> legends
                play and fans unite.
              </p>
              <SearchInput />
            </div>

            <Button primary rounded onClick={handleClick} className="-mt-7 -mb-3">
              Find Teams
            </Button>

            <div className="flex flex-col items-start w-[1079px]">
              <p className="text-left mt-10 font-bold">
                Your personal NFL travel guide.
              </p>
              <p>Find details, schedules, and insider tips for every stadium.</p>
              <div className="w-full h-px bg-gray-400"></div>
            </div>

          </div>
        </div>
      </div>
  );
}

export default Hero;
