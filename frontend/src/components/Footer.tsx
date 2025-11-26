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
          <div className="w-full h-[281px] pt-[126px] pr-[25px] pb-[27px] pl-[19px] bg-[#e93448]">
              <p className="text-white font-stretch-condensed text-7xl text-center">KEEP WATCHING THE GAME</p>
          </div>
      </div>

  );
}

export default Footer;
