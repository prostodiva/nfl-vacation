
import girl from '../../assets/girl.png';
import SearchInput from '../SearchInput';

interface DashboardGreetingProps {
    userName: string;
}

function DashboardGreeting({ userName }: DashboardGreetingProps) {
    return (
        <div className="flex flex-row space-x-4">
            {/* Greeting card */}
            <div className="bg-[#3b3c5e] rounded-lg p-6 flex items-center justify-between w-150">
                <div className="text-white">
                    <h2 className="text-2xl font-bold mb-2">HELLO {userName}!</h2>
                    <p className="text-gray-300">
                        Manage your team settings and make updates below.
                    </p>
                </div>
                <img
                    src={girl}
                    alt="Avatar"
                    className="flex h-full pointer-events-none -mt-[15%] -ml-[10%] -mr-15"
                    style={{
                        objectFit: 'contain',
                        maxHeight: '180px',
                        height: '280px',
                        transform: 'scale(1.25)', 
                    }}
                />
            </div>

            {/* Search section */}
            <div className="bg-[#3b3c5e] rounded-lg p-6 flex items-center justify-between w-110">
                <div className="text-white">
                    <h2 className="text-2xl font-bold mb-2">SEARCH & MANAGE STADIUMS</h2>
                    <SearchInput className="w-95" />
                </div>
            </div>
        </div>
    );
}

export default DashboardGreeting;