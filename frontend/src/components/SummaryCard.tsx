interface SummaryCardProps {
    algorithm: string;
    startTeam: string;
    totalDistance: number;
    teamCount: number;
}

function SummaryCard({ algorithm, startTeam, totalDistance, teamCount }: SummaryCardProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md text-[#3b3c5e] mt-8">
            <h3 className="text-xl font-bold mb-4">Route Summary</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-gray-400">Algorithm</p>
                    <p className="font-semibold">{algorithm}</p>
                </div>
                <div>
                    <p className="text-gray-600">Starting Team</p>
                    <p className="font-semibold">{startTeam}</p>
                </div>
                <div>
                    <p className="text-gray-400">Total Distance</p>
                    <p className="font-semibold">
                        {totalDistance.toLocaleString()} miles
                    </p>
                </div>
                <div>
                    <p className="text-gray-400">Teams Visited</p>
                    <p className="font-semibold">{teamCount}</p>
                </div>
            </div>
        </div>
    );
}

export default SummaryCard;