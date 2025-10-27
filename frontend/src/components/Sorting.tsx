import Navbar from "./Navbar.tsx";

function Sorting() {
    return (
        <div className="bg-gray-100">
            <div className="container mx-auto px-4 py-8 flex justify-center items-center">
                <div className="flex flex-col items-center space-y-6">
                    <Navbar

                        links={[
                            { label: 'View all', path: '/sorting' },
                            { label: 'Teams', path: '/sorting/teams' },
                            { label: 'Stadiums', path: '/sorting/stadiums' },
                        ]}
                        navClassName="w-full flex items-center gap-4 h-12 bg-gray-100 px-8"
                        linkClassName="text-m text-gray-700 hover:text-black"
                        activeLinkClassName="text-black font-semibold border-b-2 border-black"
                    />
                </div>
            </div>
        </div>
    );
}

export default Sorting;