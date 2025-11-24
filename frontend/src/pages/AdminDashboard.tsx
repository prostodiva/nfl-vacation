import LeftSidebar from "../components/dashboard/LeftSidebar";
import girl from '../assets/girl.png'
import Button from "../components/Button";

function AdminDashboard() {
    return (
       <div className="bg-gray-100 min-h-screen relative">
            <LeftSidebar />

            <div className="px-8 py-8">
                <div className="flex flex-col items-center space-y-2 mb-8">
                    <h1 className="text-5xl leading-tight text-black mt-6" style={{ fontFamily: 'SCHABO, sans-serif'}}>
                                ADMIN DASHBOARD
                    </h1>
                    <p className="text-l leading-relaxed ml-16">
                        Manage and maintain NFL data including teams, <br></br> stadiums, and souvenir catalog.
                    </p>
                </div>

                {/* Content sections below title */}
                <div className="ml-[350px] max-w-5xl mx-auto space-y-6">
                    <div className="flex flex-row space-x-4">
                         {/* Greeting card section */}
                    <div className="bg-[#262422] rounded-lg p-6 flex items-center justify-between w-150">
                        <div className="text-white">
                            <h2 className="text-2xl font-bold mb-2">HELLO RITA!</h2>
                            <p className="text-gray-300">Manage your team settings and make updates below.</p>
                        </div>
                        <img
                            src={girl}
                            alt="Girl"
                            className="absolute right-130 top-35 h-full pointer-events-none"
                                style={{
                                    objectFit: 'contain',
                                    maxHeight: '180px',
                                }}
                        />
                    </div>
                        {/*search section */}
                        <div className="bg-[#262422] rounded-lg p-6 flex items-center justify-between w-110">
                            <div className="text-white">
                                <h2 className="text-2xl font-bold mb-2">SEARCH & MANAGE STADIUMS</h2>
                                {/*search component goes here */}
                            </div>
                        </div>
                    </div>
                

                    {/* Manage Stadiums section */}
                    <div className="rounded-lg justify-between items-center">
                        <div className="flex flex-row justify-between">
                            <h3 className="text-2xl font-bold">YOU CAN ADD, EDIT, OR DELETE STADIUM ONLY HERE.</h3>
                            <div className="flex gap-4">
                                 <Button rounded submit outline>Add Stadiums</Button>
                                <Button rounded add>ADD</Button>
                            </div>
                        </div>
                    </div>

                    {/* Table section */}
                    <div className="bg-[#262422] rounded-lg p-6">
                       

                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;