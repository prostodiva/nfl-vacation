import f1 from '../assets/f1.png'
import f2 from '../assets/f2.png'
import f3 from '../assets/f3.png'
import f4 from '../assets/f4.png'

function Footer() {
    const teams = [
        "DALLAS COWBOYS",
        "GREEN BAY PACKERS",
        "KANSAS CITY CHIEFS",
        "SAN FRANCISCO 49ERS",
        "BUFFALO BILLS",
        "MIAMI DOLPHINS",
        "SEATTLE SEAHAWKS",
        "CHICAGO BEARS",
        "NEW YORK GIANTS",
        "LAS VEGAS RAIDERS",
    ];

  return (
      <div>
          <div className="overflow-x-auto whitespace-nowrap bg-[#3b3c5e] h-100">
                 <p
                    className="text-[180px] leading-none mt-25"
                    style={{ fontFamily: "SCHABO, sans-serif" }}
                    >
                    {teams.map((team, i) => (
                        <span
                        key={team}
                        className={
                            i % 2 === 0
                            ? "text-white"
                            : "text-transparent [-webkit-text-stroke:1px_white]"
                        }
                        >
                        {team}
                        {i < teams.length - 1 && " · "}
                        </span>
                    ))}
                </p>
          </div>
         <div className="w-full h-[281px] bg-[#e93448] text-white text-[70px] font-semibold flex items-center justify-start gap-4">
              <span>KEEP</span>
                  <img 
                      src={f1} 
                      alt="footer image 1" 
                      className="inline-block align-middle"
                      style={{ width: '70px', height: '70px', objectFit: 'contain' }}
                  />
                  <span>WATCHING</span>
                  <img 
                      src={f2} 
                      alt="footer image 2" 
                      className="inline-block align-middle"
                      style={{ width: '70px', height: '70px', objectFit: 'contain' }}
                  />
                  <span>THE</span>
                  <img 
                      src={f3} 
                      alt="footer image 3" 
                      className="inline-block align-middle"
                      style={{ width: '70px', height: '70px', objectFit: 'contain' }}
                  />
                  <span>GAME</span>
                  <img 
                      src={f4} 
                      alt="footer image 4" 
                      className="inline-block align-middle"
                      style={{ width: '70px', height: '70px', objectFit: 'contain' }}
                  />
              </div>
          </div>

  );
}

export default Footer;
