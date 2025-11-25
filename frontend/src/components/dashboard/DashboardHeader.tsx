
function DashboardHeader() {
    return (
        <div className="flex flex-col items-center space-y-2 mb-8">
            <h1 
                className="text-5xl leading-tight text-black mt-6" 
                style={{ fontFamily: 'SCHABO, sans-serif' }}
            >
                ADMIN DASHBOARD
            </h1>
            <p className="text-l leading-relaxed ml-16">
                Manage and maintain NFL data including teams, <br />
                stadiums, and souvenir catalog.
            </p>
        </div>
    );
}

export default DashboardHeader;